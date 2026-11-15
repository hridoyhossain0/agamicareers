import { getSessionUser } from "@/lib/server/auth-guard"
import {
    createApplication,
    listApplicationsForUser,
    type ApplicationInput,
} from "@/lib/server/applications-store"

/** Trimmed string from the posted body, or "" when absent/malformed. */
function text(value: unknown): string {
    return typeof value === "string" ? value.trim() : ""
}

/**
 * `GET /api/applications` — the signed-in user's applications, newest first.
 *
 * The Express backend's `GET /applications` returns the whole collection; here
 * the session scopes the list (a seeker only ever sees their own applications),
 * joined with the posting's type/location for the dashboard table.
 */
export async function GET() {
    const user = await getSessionUser()
    if (!user) {
        return Response.json({ error: "Sign in required" }, { status: 401 })
    }

    try {
        return Response.json(await listApplicationsForUser(user.id))
    } catch (err) {
        console.error("GET /api/applications failed:", err)
        return Response.json({ error: "Failed to load applications" }, { status: 500 })
    }
}

/**
 * `POST /api/applications` — apply to a job. Signed-in users only.
 *
 * The application is stored in the same `applications` collection the Express
 * backend writes to (`agamicareers_back_end/index.ts`), so a later switch to
 * that server keeps the data. `userId` is taken from the session (never from
 * the body) so an application can't be attributed to another account.
 * Returns `{ acknowledged, insertedId }`.
 */
export async function POST(request: Request) {
    const user = await getSessionUser()
    if (!user) {
        return Response.json({ error: "Sign in required" }, { status: 401 })
    }

    let body: unknown
    try {
        body = await request.json()
    } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 })
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return Response.json({ error: "Application body must be an object" }, { status: 400 })
    }

    const draft = body as Record<string, unknown>
    const jobId = text(draft.jobId)
    if (!jobId) {
        return Response.json({ error: "jobId is required" }, { status: 400 })
    }

    const application: ApplicationInput = {
        jobId,
        // Ownership always comes from the session, never the posted body.
        userId: user.id,
        email: text(draft.email),
        name: text(draft.name),
        jobTitle: text(draft.jobTitle),
        companyName: text(draft.companyName),
    }

    try {
        return Response.json(await createApplication(application))
    } catch (err) {
        console.error("POST /api/applications failed:", err)
        return Response.json({ error: "Failed to submit application" }, { status: 500 })
    }
}
