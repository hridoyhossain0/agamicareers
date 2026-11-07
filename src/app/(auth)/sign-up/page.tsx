'use client'
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';

export default function SignUp() {
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const user = Object.fromEntries(formData.entries()) as {
            name: string,
            email: string,
            password: string,
        }
       

        setErrorMessage('');
        const {data, error} = await authClient.signUp.email({
            ...user
            
        });

        if (data) {
            redirect('/');
        }

        if (error) {
            setErrorMessage(error.message ?? 'Unable to create your account. Please try again.');
            console.error(error);
            return;
        }

    }

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between font-sans">



            {/* Main Card Wrapper */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-md space-y-8 bg-black/40 p-8 rounded-2xl border border-neutral-900 shadow-2xl backdrop-blur-sm">

                    {/* Header Texts */}
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                            Create an account
                        </h2>
                        <p className="mt-2 text-sm text-[#555555]">
                            Get started with your AI-native career journey today.
                        </p>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-800 rounded-xl bg-neutral-900/50 hover:bg-neutral-800/80 text-sm font-medium transition-all">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.714H12.24z" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-800 rounded-xl bg-neutral-900/50 hover:bg-neutral-800/80 text-sm font-medium transition-all">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48,0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-1 h-[1px] bg-neutral-900"></div>
                        <span className="px-3 text-xs text-[#444444] uppercase tracking-wider">Or register with</span>
                        <div className="flex-1 h-[1px] bg-neutral-900"></div>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSignUp}>
                        <div>
                            <label htmlFor="name" className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name='name'
                                required
                                className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name='email'
                                type="email"
                                required
                                className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-all"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name='password'
                                required
                                className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Terms Consent */}
                        <div className="flex items-start mt-2">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                className="mt-0.5 h-4 w-4 bg-[#121212] border-neutral-800 rounded text-[#4f46e5] focus:ring-offset-0 focus:ring-0 focus:outline-none"
                            />
                            <label htmlFor="terms" className="ml-2 block text-xs text-[#555555] select-none leading-normal">
                                I agree to the <a href="#terms" className="text-neutral-400 hover:text-white underline">Terms & Conditions</a> and <a href="#privacy" className="text-neutral-400 hover:text-white underline">Privacy Guideline</a>.
                            </label>
                        </div>

                        <div>
                            <Link href="/sign-in" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                                Already have an account? <span className="text-[#6366f1]">Sign in</span>
                            </Link>
                        </div>

                        {errorMessage && (
                            <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {errorMessage}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-semibold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.99] mt-2"
                        >
                            Create Free Account
                        </button>
                    </form>
                </div>
            </div>


        </div>
    );
}
