import type { NextRequest } from "next/server"

import { requireRecruiter } from "@/lib/server/auth-guard"
import { deleteJobById, getJobById } from "@/lib/server/jobs-store"

type Params = { params: Promise<{ id: string }> }

/**
 * `GET /api/jobs/:id` — single job. **Public read** (the browse-jobs detail
 * view and the manage-jobs "View" action both need it without a session).
 */
export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = await params
    try {
        const job = await getJobById(id)
        if (!job) return Response.json({ error: "Job not found" }, { status: 404 })
        return Response.json(job)
    } catch (err) {
        console.error(`GET /api/jobs/${id} failed:`, err)
        return Response.json({ error: "Failed to load job" }, { status: 500 })
    }
}

/**
 * `DELETE /api/jobs/:id` — delete a job (manage-jobs "Delete").
 * Recruiter/admin only, and **owner-only**: the poster may delete their own
 * listing, an admin may delete any.
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
    const user = await requireRecruiter()
    if (user instanceof Response) return user

    const { id } = await params
    try {
        const outcome = await deleteJobById(id, {
            id: user.id,
            isAdmin: user.role === "admin",
        })
        if (outcome === "missing") return Response.json({ error: "Job not found" }, { status: 404 })
        if (outcome === "forbidden") {
            return Response.json({ error: "You can only delete your own jobs" }, { status: 403 })
        }
        return Response.json({ deletedCount: 1, _id: id })
    } catch (err) {
        console.error(`DELETE /api/jobs/${id} failed:`, err)
        return Response.json({ error: "Failed to delete job" }, { status: 500 })
    }
}
