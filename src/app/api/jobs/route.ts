import type { NextRequest } from "next/server"

import { requireRecruiter } from "@/lib/server/auth-guard"
import { createJob, listJobs } from "@/lib/server/jobs-store"

/**
 * `GET /api/jobs` — list jobs, newest first. **Public read**: job listings are
 * what the public `/browse-jobs` board shows, so anyone (including logged-out
 * visitors) may list them — same as the old Express `GET /jobs`.
 * Optional filters: `q` (title/company), `status`, `category` ("all"/empty
 * skips one), `jobType` (comma-separated), `location`, `remote=1`, `posted`
 * ("24h"/"week"/"month"), `salaryMin`/`salaryMax` (annualized), and `mine=1`
 * — the one non-public mode: it requires a recruiter/admin session and
 * returns only that account's own postings (the manage-jobs dashboard).
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams

    let createdBy: string | undefined
    if (params.get("mine") === "1") {
        const user = await requireRecruiter()
        if (user instanceof Response) return user
        createdBy = user.id
    }

    try {
        const jobs = await listJobs({
            q: params.get("q") ?? "",
            status: params.get("status") ?? "",
            category: params.get("category") ?? "",
            jobType: params.get("jobType") ?? "",
            location: params.get("location") ?? "",
            remote: params.get("remote") ?? "",
            posted: params.get("posted") ?? "",
            salaryMin: params.get("salaryMin") ?? "",
            salaryMax: params.get("salaryMax") ?? "",
            createdBy,
        })
        return Response.json(jobs)
    } catch (err) {
        console.error("GET /api/jobs failed:", err)
        return Response.json({ error: "Failed to load jobs" }, { status: 500 })
    }
}

/** `POST /api/jobs` — create a job. Recruiter/admin only. Returns `{ acknowledged, insertedId }`. */
export async function POST(request: Request) {
    const user = await requireRecruiter()
    if (user instanceof Response) return user

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
        // `createdBy` is spread last so ownership always comes from the
        // session, never from whatever the client sent in the body.
        const job = await createJob({ ...(body as Record<string, unknown>), createdBy: user.id })
        return Response.json(job)
    } catch (err) {
        console.error("POST /api/jobs failed:", err)
        return Response.json({ error: "Failed to create job" }, { status: 500 })
    }
}
