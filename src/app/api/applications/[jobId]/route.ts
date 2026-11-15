import type { NextRequest } from "next/server"

import { getSessionUser } from "@/lib/server/auth-guard"
import { deleteApplicationForJob, findApplicationForJob } from "@/lib/server/applications-store"

type Params = { params: Promise<{ jobId: string }> }

/**
 * `GET /api/applications/:jobId` — has the signed-in user applied to this job?
 *
 * Signed-out visitors get `{ applied: false }` (not a 401) so the job details
 * page can render its button state without treating "no session" as an error.
 */
export async function GET(_request: NextRequest, { params }: Params) {
    const user = await getSessionUser()
    if (!user) {
        return Response.json({ applied: false, applicationId: null })
    }

    const { jobId } = await params
    try {
        const application = await findApplicationForJob(user.id, jobId)
        return Response.json({
            applied: application !== null,
            applicationId: application?.applicationId ?? null,
        })
    } catch (err) {
        console.error(`GET /api/applications/${jobId} failed:`, err)
        return Response.json({ error: "Failed to load application" }, { status: 500 })
    }
}

/**
 * `DELETE /api/applications/:jobId` — withdraw the caller's application to
 * this job (the second click on "Applied"). Only the session user's rows are
 * touched. Returns `{ acknowledged, deletedCount }`.
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
    const user = await getSessionUser()
    if (!user) {
        return Response.json({ error: "Sign in required" }, { status: 401 })
    }

    const { jobId } = await params
    try {
        return Response.json(await deleteApplicationForJob(user.id, jobId))
    } catch (err) {
        console.error(`DELETE /api/applications/${jobId} failed:`, err)
        return Response.json({ error: "Failed to withdraw application" }, { status: 500 })
    }
}
