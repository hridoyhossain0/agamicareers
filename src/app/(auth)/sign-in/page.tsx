'use client'
import { AuthForm, type AuthFormData } from '@/componants/AuthForm';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

export default function SignIn() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignInContent />
        </Suspense>
    );
}

/**
 * `useRouter`/`useSearchParams` are request-time APIs: they must sit behind a
 * page-level `<Suspense>` boundary or prerendering `/sign-in` fails with
 * `CLIENT_HOOK_DYNAMIC` (same pattern as `/browse-jobs/[id]`).
 */
function SignInContent() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, setIsPending] = useState(false);

    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/';

    /**
     * AuthForm already called `preventDefault()` and collected the field values;
     * it hands them to us as `AuthFormData` (not as a submit event).
     */
    const handleSignIn = async (values: AuthFormData) => {
        setErrorMessage('');
        setIsPending(true);

        try {
            const { data, error } = await authClient.signIn.email({
                email: values.email,
                password: values.password,
                callbackURL: redirectTo,
            });

            if (error) {
                setErrorMessage(error.message ?? 'Unable to sign in. Please try again.');
                return;
            }

            if (data) {
                // `redirect()` only works during render — use the router in handlers.
                router.refresh();
                router.push('/');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Unable to sign in. Please try again.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <AuthForm
            mode="signin"
            onSubmit={handleSignIn}
            error={errorMessage}
            pending={isPending}
        />
    );
}
