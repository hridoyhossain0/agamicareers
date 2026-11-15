const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

/** Body accepted by `POST /applications` (built in `JobHeaderBar`). */
export type JobApplicationInput = {
    jobId: string
    userId: string
    email: string
    name: string
    jobTitle: string
    companyName: string
}

/** API payload for a successful application. */
export type JobApplicationResult = {
    acknowledged?: boolean
    insertedId?: string
}

/** Whether the signed-in user already applied to a job. */
export type JobApplicationState = {
    applied: boolean
    applicationId: string | null
}

export async function applyToJob(data: JobApplicationInput): Promise<JobApplicationResult> {
    const res = await fetch(`${BASE_URL}/applications`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`Failed to apply to job (${res.status})`)
    return res.json()
}

/** Reads the current "Applied"/"Apply Now" state of a job for this user. */
export async function getApplicationState(jobId: string): Promise<JobApplicationState> {
    const res = await fetch(`${BASE_URL}/applications/${encodeURIComponent(jobId)}`, {
        cache: "no-store",
    })
    if (!res.ok) throw new Error(`Failed to load application state (${res.status})`)
    return res.json()
}

/** Withdraws the application — the second click on the "Applied" button. */
export async function withdrawApplication(
    jobId: string,
): Promise<{ acknowledged?: boolean; deletedCount?: number }> {
    const res = await fetch(`${BASE_URL}/applications/${encodeURIComponent(jobId)}`, {
        method: "DELETE",
    })
    if (!res.ok) throw new Error(`Failed to withdraw application (${res.status})`)
    return res.json()
}
