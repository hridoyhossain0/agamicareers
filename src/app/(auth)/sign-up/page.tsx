'use client'

import { AuthForm, type AuthFormData } from '@/componants/AuthForm';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import * as React from "react"

export default function SignUp() {
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState(false);

    /**
     * AuthForm already called `preventDefault()` and collected the field values;
     * it hands them to us as `AuthFormData` (not as a submit event).
     */
    const handleSignUp = async (values: AuthFormData) => {
        setError(null);
        setIsPending(true);

        try {
            const { data, error: signUpError } = await authClient.signUp.email({
                name: values.name ?? '',
                email: values.email,
                password: values.password,
                // `role` is registered as an `input: true` additional field in lib/auth.ts.
                ...(values.role ? { role: values.role } : {}),
            });

            if (signUpError) {
                // e.g. 422 "User already exists. Use another email."
                setError(signUpError.message || "Something went wrong. Please try again.");
                return;
            }

            if (data) {
                router.refresh();
                router.push("/");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <AuthForm mode="signup" onSubmit={handleSignUp} error={error} pending={isPending} />
    );
}
