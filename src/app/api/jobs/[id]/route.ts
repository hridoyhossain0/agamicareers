import type { NextRequest } from "next/server"

import { requireRecruiter } from "@/lib/server/auth-guard"
import { deleteJobById, getJobById } from "@/lib/server/jobs-store"

type Params = { params: Promise<{ id: string }> }

/** `GET /api/jobs/:id` — single job (used by the manage-jobs "View" action). */
export async function GET(_request: NextRequest, { params }: Params) {
    const denied = await requireRecruiter()
    if (denied) return denied

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

/** `DELETE /api/jobs/:id` — delete a job (used by the manage-jobs "Delete" action). */
export async function DELETE(_request: NextRequest, { params }: Params) {
    const denied = await requireRecruiter()
    if (denied) return denied

    const { id } = await params
    try {
        const deleted = await deleteJobById(id)
        if (!deleted) return Response.json({ error: "Job not found" }, { status: 404 })
        return Response.json({ deletedCount: 1, _id: id })
    } catch (err) {
        console.error(`DELETE /api/jobs/${id} failed:`, err)
        return Response.json({ error: "Failed to delete job" }, { status: 500 })
    }
}
