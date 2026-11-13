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
}

/** Escape regex metacharacters so the search string is matched literally. */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
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

/** List jobs, newest first. Optional filters: `q` (title/company), `status`, `category`. */
export async function listJobs({ q = "", status = "", category = "" }: JobQuery) {
    const filter: Filter<Document> = {}

    const term = q.trim()
    if (term) {
        const rx = { $regex: escapeRegExp(term), $options: "i" }
        filter.$or = [{ title: rx }, { companyName: rx }]
    }
    if (status && status !== "all") filter.status = status
    if (category && category !== "all") filter.category = category

    const docs = await jobsCollection().find(filter).sort({ _id: -1 }).toArray()
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

/** Delete a job. Returns false for an invalid id or a job that doesn't exist. */
export async function deleteJobById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false
    const result = await jobsCollection().deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
}
