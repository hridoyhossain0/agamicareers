// Server-only authorization for the jobs API — keeps the recruiter
// dashboard's data away from anonymous visitors. (The old Express API had no
// auth at all, so this is a deliberate tightening.)

import { headers } from "next/headers"

import { auth } from "@/lib/auth"

// better-auth doesn't expose the custom `role` field on its session type —
// the client narrows it the same way (see `DashboardSidebar` / `NavBar`).
type SessionUser = { role?: string }

/** Roles allowed to list/create/delete job listings. */
const ALLOWED_ROLES = new Set(["recruiter", "admin"])

/**
 * Returns `null` when the caller may proceed, otherwise the JSON response to
 * return: 401 when signed out, 403 when the account isn't a recruiter/admin.
 *
 * Usage in a Route Handler:
 *   const denied = await requireRecruiter()
 *   if (denied) return denied
 */
export async function requireRecruiter(): Promise<Response | null> {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return Response.json({ error: "Sign in required" }, { status: 401 })
    }

    const role = (session.user as SessionUser).role
    if (!role || !ALLOWED_ROLES.has(role)) {
        return Response.json({ error: "Recruiter access required" }, { status: 403 })
    }

    return null
}
