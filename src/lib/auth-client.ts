import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    /**
     * Same-origin by default: better-auth falls back to `window.location.origin`
     * in the browser (and `BETTER_AUTH_URL` on the server), so auth works on any
     * port/domain. Set `NEXT_PUBLIC_BETTER_AUTH_URL` only if the auth API is hosted
     * somewhere else — never hardcode `http://localhost:3000`.
     */
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})

export const { signIn, signUp, signOut, useSession } = authClient;
