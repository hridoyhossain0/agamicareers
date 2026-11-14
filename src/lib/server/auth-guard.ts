// Server-only authorization for the jobs API — keeps the recruiter
// dashboard's data away from anonymous visitors. (The old Express API had no
// auth at all, so this is a deliberate tightening.)

import { headers } from "next/headers"

import { auth } from "@/lib/auth"

// better-auth doesn't expose the custom `role` field on its session type —
// the client narrows it the same way (see `DashboardSidebar` / `NavBar`).
type SessionUser = { id?: string; role?: string }

/** Roles allowed to list/create/delete job listings. */
const ALLOWED_ROLES = new Set(["recruiter", "admin"])

/** The signed-in account: `id` stamps job ownership, `role` gates access. */
export type SignedInUser = { id: string; role?: string }

/** The signed-in account, or `null` when there is no session. */
export async function getSessionUser(): Promise<SignedInUser | null> {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return null

    const user = session.user as SessionUser
    // A session without an id can't own anything — treat it as signed out.
    if (!user.id) return null
    return { id: user.id, role: user.role }
}

/**
 * Returns the signed-in recruiter/admin together with its account id, or the
 * JSON response to return as-is: 401 when signed out, 403 when the account
 * isn't a recruiter/admin.
 *
 * Usage in a Route Handler:
 *   const user = await requireRecruiter()
 *   if (user instanceof Response) return user
 */
export async function requireRecruiter(): Promise<SignedInUser | Response> {
    const user = await getSessionUser()
    if (!user) {
        return Response.json({ error: "Sign in required" }, { status: 401 })
    }

    if (!user.role || !ALLOWED_ROLES.has(user.role)) {
        return Response.json({ error: "Recruiter access required" }, { status: 403 })
    }

    return user
}
