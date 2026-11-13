// Placeholder: this route was committed as an empty file, which fails
// `next build` ("File ... is not a module"). Nothing links to `/checkout/:id`
// yet, so send visitors to the real checkout page until a per-job checkout
// exists — replace this with the actual flow when it's built.

import { redirect } from "next/navigation"

export default function CheckoutByIdPage() {
    redirect("/checkout")
}
