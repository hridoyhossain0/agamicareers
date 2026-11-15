// Server-only applications data access for `app/api/applications/route.ts`.
//
// Mirrors the Express API in `agamicareers_back_end/index.ts` (same
// `applications` collection in the same database: `POST /applications` inserts,
// `GET /applications` lists), plus a `createdAt` stamp so the dashboard can
// order applications without inventing a date.

import { MongoClient, ObjectId, type Collection, type Document } from "mongodb"

const DATABASE_NAME = "agamicareers-data"
const COLLECTION_NAME = "applications"
const JOBS_COLLECTION_NAME = "jobs"

// One client per process (same pattern as `jobs-store.ts`): re-creating a
// MongoClient on every dev HMR reload leaks connection pools.
const globalForMongo = globalThis as typeof globalThis & {
    __applicationsMongoClient?: MongoClient
}

function database() {
    if (!globalForMongo.__applicationsMongoClient) {
        globalForMongo.__applicationsMongoClient = new MongoClient(process.env.MONGODB_URL as string)
    }
    // The driver connects lazily on the first operation (same as `lib/auth.ts`).
    return globalForMongo.__applicationsMongoClient.db(DATABASE_NAME)
}

function applicationsCollection(): Collection<Document> {
    return database().collection(COLLECTION_NAME)
}

function jobsCollection(): Collection<Document> {
    return database().collection(JOBS_COLLECTION_NAME)
}

/** A job application: who applied, and which posting they applied to. */
export type ApplicationInput = {
    jobId: string
    userId: string
    email: string
    name: string
    jobTitle: string
    companyName: string
}

/** Insert an application and return the Mongo write result the client checks. */
export async function createApplication(application: ApplicationInput) {
    const result = await applicationsCollection().insertOne({
        ...application,
        createdAt: new Date(),
    })
    return { acknowledged: result.acknowledged, insertedId: String(result.insertedId) }
}

/**
 * The signed-in user's application to one job, or `null` when they haven't
 * applied. Backs the "Apply Now" ⇄ "Applied" toggle on the job details page.
 */
export async function findApplicationForJob(userId: string, jobId: string) {
    if (!ObjectId.isValid(jobId)) return null
    const doc = await applicationsCollection().findOne(
        { userId, jobId },
        { projection: { _id: 1 } },
    )
    return doc ? { applicationId: String(doc._id) } : null
}

/**
 * Withdraw (delete) this user's application(s) to one job — clicking the
 * "Applied" button again removes the row from `applications`.
 */
export async function deleteApplicationForJob(userId: string, jobId: string) {
    if (!ObjectId.isValid(jobId)) return { acknowledged: true, deletedCount: 0 }
    const result = await applicationsCollection().deleteMany({ userId, jobId })
    return { acknowledged: result.acknowledged, deletedCount: result.deletedCount }
}

/** The posting fields the applications table shows next to the stored title. */
export type ApplicationJob = {
    jobType?: string
    location?: string
    isRemote?: boolean
    category?: string
}

/** One stored application, serialized for the seeker dashboard. */
export type StoredApplication = {
    _id: string
    jobId: string
    email: string
    name: string
    jobTitle: string
    companyName: string
    /** ISO timestamp — falls back to the ObjectId timestamp for older docs. */
    createdAt: string
    /** Present once a recruiter moves the application along. */
    status?: string
    archived?: boolean
    /** Live posting data, or null when the job was deleted. */
    job: ApplicationJob | null
}

/**
 * When the application was submitted. `POST /api/applications` stamps
 * `createdAt`; older docs fall back to the ObjectId's embedded timestamp — also
 * a real creation time, so no date here is ever invented.
 */
function applicationCreatedAt(doc: Document): Date {
    if (doc.createdAt) {
        const stamped = new Date(doc.createdAt)
        if (!Number.isNaN(stamped.getTime())) return stamped
    }
    const id = String(doc._id)
    return ObjectId.isValid(id) ? new ObjectId(id).getTimestamp() : new Date()
}

/**
 * The signed-in seeker's applications, newest first.
 *
 * `GET /applications` in the Express backend returns every application in the
 * collection; this server-side twin only returns the caller's own, joined with
 * the posting so the table can show job type/location without a second request.
 */
export async function listApplicationsForUser(userId: string): Promise<StoredApplication[]> {
    const docs = await applicationsCollection().find({ userId }).sort({ _id: -1 }).toArray()

    const jobIds = [...new Set(docs.map((doc) => String(doc.jobId)))].filter((id) => ObjectId.isValid(id))
    const jobs = jobIds.length
        ? await jobsCollection()
              .find(
                  { _id: { $in: jobIds.map((id) => new ObjectId(id)) } },
                  { projection: { jobType: 1, location: 1, isRemote: 1, category: 1 } },
              )
              .toArray()
        : []
    const jobById = new Map(jobs.map((job) => [String(job._id), job]))

    return docs.map((doc) => {
        const job = jobById.get(String(doc.jobId))
        return {
            _id: String(doc._id),
            jobId: String(doc.jobId),
            email: String(doc.email ?? ""),
            name: String(doc.name ?? ""),
            jobTitle: String(doc.jobTitle ?? ""),
            companyName: String(doc.companyName ?? ""),
            createdAt: applicationCreatedAt(doc).toISOString(),
            status: typeof doc.status === "string" ? doc.status : undefined,
            archived: doc.archived === true,
            job: job
                ? {
                      jobType: typeof job.jobType === "string" ? job.jobType : undefined,
                      location: typeof job.location === "string" ? job.location : undefined,
                      isRemote: job.isRemote === true,
                      category: typeof job.category === "string" ? job.category : undefined,
                  }
                : null,
        }
    })
}
