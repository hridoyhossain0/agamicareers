// Single data-access module for the jobs API (Next.js Route Handlers in
// `app/api/jobs` — they read/write the same MongoDB collection the old
// Express server on :5000 used).
// Replaces the old split between `lib/api/jobs.ts` and `lib/actions/jobs.ts`.

import type { JobFormData, JobRow } from "@/lib/types/jobs"

// Same-origin `/api` by default; set NEXT_PUBLIC_API_BASE_URL to point at a
// standalone server (e.g. `http://localhost:5000`) instead.
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

export const getJobs = async (query = ''): Promise<JobRow[]> => {
    const res = await fetch(`${BASE_URL}/jobs?${query}`)
    if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
}

export const getJobById = async (jobId: string): Promise<JobRow> => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`)
    if (!res.ok) throw new Error(`Failed to load job (${res.status})`)
    return res.json()
}

export const createJob = async (data: JobFormData) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    })
    return res.json()
}

export const deleteJob = async (jobId: string) => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
    })
    if (!res.ok) throw new Error(`Failed to delete job (${res.status})`)
    return res.json()
}