'use client'
import React, { useEffect, useState } from 'react';
import { Bookmark, Briefcase, Building2, Check, Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import {
    applyToJob,
    getApplicationState,
    withdrawApplication,
} from '@/lib/actions/applications';
import { toast } from '@/components/ui/toast';
import type { JobRow } from '@/lib/types/jobs';

/** better-auth doesn't expose the custom `role` field on its session type
 *  (same narrowing as `DashboardSidebar` / `NavBar`). */
type SessionUser = {
    id: string;
    email: string;
    name: string;
    role?: string;
};

interface JobHeaderBarProps {
    title: string;
    job: JobRow;
    id: string;
}

export default function JobHeaderBar({
    title,  
    job,
    id,
    
}: JobHeaderBarProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    /** Mirrors the API: "Apply Now" ⇄ "Applied" (second click withdraws). */
    const [applied, setApplied] = useState(false);
    const [checkingApplication, setCheckingApplication] = useState(true);
    const [pending, setPending] = useState(false);

    const {data: session} = useSession();
    const user = session?.user as SessionUser | undefined;

    const router = useRouter();

    // Load the real button state for this job. Guests get `applied: false`.
    useEffect(() => {
        let cancelled = false;
        const check = async () => {
            try {
                const state = await getApplicationState(job._id);
                if (!cancelled) setApplied(state.applied);
            } catch (error) {
                console.error('Failed to check application state:', error);
            } finally {
                if (!cancelled) setCheckingApplication(false);
            }
        };
        void check();
        return () => { cancelled = true; };
    }, [job._id]);

    const handleApplyNow = async () => {
        if(!user) {
            router.push(`/sign-in?redirectTo=/browse-jobs/${id}`);
            return;
        }

        // Seekers are the accounts that apply (the app defaults a missing role
        // to "seeker" — same as `DashboardSidebar` / `NavBar`).
        if ((user.role ?? 'seeker') !== 'seeker' || pending) return;

        setPending(true);

        try {
            if (applied) {
                // Second click: withdraw and remove the row from the database.
                const result = await withdrawApplication(job._id);
                if (result.deletedCount) {
                    setApplied(false);
                    toast.add({ type: 'info', title: 'Application withdrawn' });
                } else {
                    setApplied(false);
                    toast.add({ type: 'error', title: 'No application to withdraw. Please try again.' });
                }
                return;
            }

            const result = await applyToJob({
                jobId: job._id,
                userId: user.id,
                email: user.email,
                name: user.name,
                jobTitle: job.title,
                companyName: job.companyName,
            });

            if (result.insertedId) {
                setApplied(true);
                toast.add({ type: 'success', title: 'Applied job' });
            } else {
                toast.add({ type: 'error', title: 'Failed to submit application. Please try again.' });
            }
        } catch (error) {
            // `applyToJob` / `withdrawApplication` throw on non-2xx — surface it
            // instead of failing silently.
            console.error('Application request failed:', error);
            toast.add({
                type: 'error',
                title: applied
                    ? 'Failed to withdraw application. Please try again.'
                    : 'Failed to submit application. Please try again.',
            });
        } finally {
            setPending(false);
        }
    };

    


    return (
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121214] shadow-2xl">
            {/* Ambient highlight — purely decorative */}
            <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                {/* Left Section: Logo & Job Details */}
                <div className="flex items-start gap-4 md:gap-5">
                    {/* Company Logo Square */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#1E1E24] to-[#141416] shadow-inner md:h-[4.5rem] md:w-[4.5rem]">
                        <Briefcase className="h-6 w-6 text-gray-300 md:h-7 md:w-7" />
                    </div>

                    {/* Info Column */}
                    <div className="min-w-0 flex flex-col gap-2">
                        <h1 className="text-xl font-semibold leading-tight tracking-tight text-white md:text-3xl">
                            {title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-400">
                            <Building2 aria-hidden className="h-4 w-4 shrink-0 text-gray-500" />
                            <span className="font-light">{job.companyName}</span>
                        </div>
                    </div>
                </div>

                {/* Right Section: Action Elements */}
                <div className="flex shrink-0 items-center gap-3">
                    {/* Save/Bookmark Button */}
                    <button
                        type="button"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this job'}
                        aria-pressed={isBookmarked}
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 ${isBookmarked
                            ? 'border-purple-500/30 bg-[#1C1625] text-purple-400'
                            : 'border-white/[0.06] bg-[#18181C] text-gray-400 hover:bg-[#202026] hover:text-white'
                            }`}
                    >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Primary CTA — toggles between Apply Now and Applied */}
                    <button
                        type="button"
                        onClick={handleApplyNow}
                        disabled={pending || checkingApplication}
                        aria-pressed={applied}
                        title={applied ? 'Click again to withdraw your application' : undefined}
                        className={`flex h-12 items-center gap-2 rounded-xl px-7 text-sm font-semibold shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${applied
                            ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 focus-visible:ring-emerald-500/40'
                            : 'bg-white text-black hover:bg-gray-100 focus-visible:ring-white/40'
                            }`}
                    >
                        {pending ? (
                            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                        ) : applied ? (
                            <Check aria-hidden className="h-4 w-4" />
                        ) : null}
                        {applied ? 'Applied' : 'Apply Now'}
                    </button>
                </div>
            </div>
        </section>
    );
}
