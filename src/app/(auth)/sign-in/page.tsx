'use client'
import { AuthForm, type AuthFormData } from '@/componants/AuthForm';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, setIsPending] = useState(false);

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
