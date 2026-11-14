// Server-only jobs data access, shared by the Route Handlers in
// `app/api/jobs/route.ts` and `app/api/jobs/[id]/route.ts`.
//
// It mirrors the Express API in `agamicareers_back_end/index.ts` (same
// database, same query params, same response shape) so the manage-jobs table
// keeps working unchanged — it was written against that payload.

import { MongoClient, ObjectId, type Collection, type Document, type Filter } from "mongodb"

const DATABASE_NAME = "agamicareers-data"
const COLLECTION_NAME = "jobs"

// One client per process: re-creating a MongoClient on every dev HMR reload
// leaks connection pools and can exhaust the Atlas connection limit.
const globalForMongo = globalThis as typeof globalThis & { __jobsMongoClient?: MongoClient }

function jobsCollection(): Collection<Document> {
    if (!globalForMongo.__jobsMongoClient) {
        globalForMongo.__jobsMongoClient = new MongoClient(process.env.MONGODB_URL as string)
    }
    // The driver connects lazily on the first operation (same as `lib/auth.ts`).
    return globalForMongo.__jobsMongoClient.db(DATABASE_NAME).collection(COLLECTION_NAME)
}

/** Filters accepted by `GET /api/jobs` — pass "all"/empty to skip one. */
export type JobQuery = {
    q?: string
    status?: string
    category?: string
    /** Comma-separated `JobType` values ("full-time,contract"). */
    jobType?: string
    /** Case-insensitive match against `location`. */
    location?: string
    /** `"1"`/`"true"` keeps only remote listings. */
    remote?: string
    /** `"24h"`, `"week"` or `"month"` — posted within that window. */
    posted?: string
    /** Annualized salary bounds (the API normalizes `salaryFrequency`). */
    salaryMin?: string
    salaryMax?: string
    /** Restrict to jobs posted by this account (the `mine=1` dashboard mode). */
    createdBy?: string
}

/** Escape regex metacharacters so the search string is matched literally. */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Look-back windows for the `posted` filter, in milliseconds. */
const POSTED_WINDOWS_MS: Record<string, number> = {
    "24h": 86_400_000,
    week: 7 * 86_400_000,
    month: 30 * 86_400_000,
}

/** Start of the `posted` window, or null when the value is unknown/empty. */
function postedSince(posted: string): Date | null {
    const ms = POSTED_WINDOWS_MS[posted]
    return ms ? new Date(Date.now() - ms) : null
}

/** Parse a query-string number; anything invalid means "no bound". */
function parseBound(value: string): number | null {
    if (!value) return null
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

/** Pay periods → how many of them fit in a year (for annualized comparisons). */
const SALARY_MULTIPLIER: Record<string, number> = {
    "per hour": 2_080,
    "per day": 260,
    "per week": 52,
    "per month": 12,
    "per year": 1,
}

/**
 * Aggregation expression: the doc's `field` converted to an annual number.
 * Non-numeric/empty salary strings become `null`, so jobs without a range are
 * excluded (rather than treated as zero) once a salary filter is applied.
 */
function annualSalaryExpr(field: "minSalary" | "maxSalary"): Document {
    return {
        $multiply: [
            { $convert: { input: `$${field}`, to: "double", onError: null, onNull: null } },
            {
                $switch: {
                    branches: Object.entries(SALARY_MULTIPLIER).map(([frequency, multiplier]) => ({
                        case: { $eq: ["$salaryFrequency", frequency] },
                        then: multiplier,
                    })),
                    default: 1,
                },
            },
        ],
    }
}

/**
 * When the job was posted. `POST /api/jobs` stamps `createdAt`; jobs created
 * before that fall back to the ObjectId's embedded timestamp — also a real
 * creation time, so no date returned by this API is ever invented.
 */
function jobCreatedAt(doc: Document): Date {
    if (doc.createdAt) {
        const stamped = new Date(doc.createdAt)
        if (!Number.isNaN(stamped.getTime())) return stamped
    }
    const id = String(doc._id)
    return ObjectId.isValid(id) ? new ObjectId(id).getTimestamp() : new Date()
}

/** Relative label for the manage-jobs "Date Posted" column, e.g. "Posted 4d ago". */
function postedLabel(createdAt: Date): string {
    const days = Math.floor((Date.now() - createdAt.getTime()) / 86_400_000)
    if (days <= 0) return "Posted today"
    return `Posted ${days}d ago`
}

/** Serialize a stored job for API responses. */
function serializeJob(doc: Document) {
    const { _id, createdAt, ...rest } = doc
    void createdAt // always recomputed from `jobCreatedAt`
    const postedAt = jobCreatedAt(doc)
    return {
        ...rest,
        _id: String(_id),
        createdAt: postedAt.toISOString(),
        posted: postedLabel(postedAt),
    }
}

/** List jobs, newest first. Optional filters: `q` (title/company), `status`, `category`, `jobType`, `location`, `remote`, `posted`, `salaryMin`/`salaryMax`, `createdBy`. */
export async function listJobs({
    q = "",
    status = "",
    category = "",
    jobType = "",
    location = "",
    remote = "",
    posted = "",
    salaryMin = "",
    salaryMax = "",
    createdBy = "",
}: JobQuery) {
    const filter: Filter<Document> = {}
    // Regex searches and the date window are combined with `$and` so neither
    // can overwrite the other's `$or`.
    const conditions: Filter<Document>[] = []

    const term = q.trim()
    if (term) {
        const rx = { $regex: escapeRegExp(term), $options: "i" }
        conditions.push({ $or: [{ title: rx }, { companyName: rx }] })
    }
    if (status && status !== "all") filter.status = status
    if (category && category !== "all") filter.category = category

    const types = jobType
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    if (types.length) filter.jobType = { $in: types }

    const where = location.trim()
    if (where) filter.location = { $regex: escapeRegExp(where), $options: "i" }

    if (remote === "1" || remote === "true") filter.isRemote = true

    // `createdAt` is stamped on new postings; older docs fall back to the
    // ObjectId's embedded timestamp (both are real creation times).
    const since = postedSince(posted)
    if (since) {
        conditions.push({
            $or: [
                { createdAt: { $gte: since } },
                { _id: { $gte: ObjectId.createFromTime(Math.floor(since.getTime() / 1000)) } },
            ],
        })
    }

    // Jobs posted before ownership existed have no `createdBy` and therefore
    // match no one's `mine` list (the legacy doc is backfilled once).
    if (createdBy) filter.createdBy = createdBy

    if (conditions.length) filter.$and = conditions

    const minSalary = parseBound(salaryMin)
    const maxSalary = parseBound(salaryMax)

    // No salary filter: the original find path, untouched.
    if (minSalary === null && maxSalary === null) {
        const docs = await jobsCollection().find(filter).sort({ _id: -1 }).toArray()
        return docs.map(serializeJob)
    }

    // Salary filter: annualize both bounds, then keep overlapping ranges.
    // `annualMin`/`annualMax` are null for postings without a range, and a
    // null never satisfies a numeric comparison, so those drop out.
    const salaryMatch: Document = {}
    if (minSalary !== null) salaryMatch.annualMax = { $gte: minSalary }
    if (maxSalary !== null) salaryMatch.annualMin = { $lte: maxSalary }

    const docs = await jobsCollection()
        .aggregate<Document>([
            { $match: filter },
            {
                $addFields: {
                    annualMin: annualSalaryExpr("minSalary"),
                    annualMax: annualSalaryExpr("maxSalary"),
                },
            },
            { $match: salaryMatch },
            { $sort: { _id: -1 } },
            { $project: { annualMin: 0, annualMax: 0 } },
        ])
        .toArray()

    return docs.map(serializeJob)
}

/** Single job (used by the manage-jobs "View" action), or null when unknown. */
export async function getJobById(id: string) {
    if (!ObjectId.isValid(id)) return null
    const doc = await jobsCollection().findOne({ _id: new ObjectId(id) })
    return doc ? serializeJob(doc) : null
}

/** Insert a job, stamping the posting date so "Date Posted" renders without a lookup. */
export async function createJob(body: Document) {
    const result = await jobsCollection().insertOne({ ...body, createdAt: new Date() })
    return { acknowledged: result.acknowledged, insertedId: String(result.insertedId) }
}

/** Who is trying to delete: the poster's account, or an admin (any job). */
export type DeleteOwner = { id: string; isAdmin: boolean }

/**
 * Delete a job the caller is allowed to remove.
 * Returns `"deleted"`, `"missing"` (no such job / invalid id), or
 * `"forbidden"` (the listing belongs to another account). Owner-only, with
 * admins bypassing the check — see decision in the manage-jobs scoping work.
 */
export async function deleteJobById(
    id: string,
    owner: DeleteOwner,
): Promise<"deleted" | "missing" | "forbidden"> {
    if (!ObjectId.isValid(id)) return "missing"
    const _id = new ObjectId(id)

    const doc = await jobsCollection().findOne({ _id }, { projection: { createdBy: 1 } })
    if (!doc) return "missing"
    // A doc without `createdBy` belongs to no one, so only an admin clears it.
    if (!owner.isAdmin && doc.createdBy !== owner.id) return "forbidden"

    await jobsCollection().deleteOne({ _id })
    return "deleted"
}
