import type { NextRequest } from "next/server"

import { requireRecruiter } from "@/lib/server/auth-guard"
import { createJob, listJobs } from "@/lib/server/jobs-store"

/**
 * `GET /api/jobs` — list jobs, newest first.
 * Optional filters: `q` (title/company), `status`, `category` ("all"/empty skips one).
 * Mirrors Express `GET /jobs` so the manage-jobs page payload is unchanged.
 */
export async function GET(request: NextRequest) {
    const denied = await requireRecruiter()
    if (denied) return denied

    const params = request.nextUrl.searchParams
    try {
        const jobs = await listJobs({
            q: params.get("q") ?? "",
            status: params.get("status") ?? "",
            category: params.get("category") ?? "",
        })
        return Response.json(jobs)
    } catch (err) {
        console.error("GET /api/jobs failed:", err)
        return Response.json({ error: "Failed to load jobs" }, { status: 500 })
    }
}

/** `POST /api/jobs` — create a job. Returns `{ acknowledged, insertedId }`. */
export async function POST(request: Request) {
    const denied = await requireRecruiter()
    if (denied) return denied

    let body: unknown
    try {
        body = await request.json()
    } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 })
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return Response.json({ error: "Job body must be an object" }, { status: 400 })
    }

    try {
        const job = await createJob(body as Record<string, unknown>)
        return Response.json(job)
    } catch (err) {
        console.error("POST /api/jobs failed:", err)
        return Response.json({ error: "Failed to create job" }, { status: 500 })
    }
}
