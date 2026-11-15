'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, Loader2, SearchX } from 'lucide-react';

import JobDescriptionDetail from '@/componants/browse-jobs/Details-page/JobDescriptionDetail';
import JobHeaderBar from '@/componants/browse-jobs/Details-page/JobHeaderBar';
import JobStatsGrid from '@/componants/browse-jobs/Details-page/JobStatsGrid';
import { getJobById } from '@/lib/api/jobs';
import type { JobRow } from '@/lib/types/jobs';

type View = 'loading' | 'ready' | 'notFound' | 'error';

/** "full-time" → "Full-time" (same formatting as the listings + manage table). */
const typeLabel = (jobType: string) => jobType.charAt(0).toUpperCase() + jobType.slice(1);

function jobLocation(job: JobRow): string {
    const base = job.location || (job.isRemote ? 'Remote' : '');
    return job.location && job.isRemote ? `${base} · Remote` : base;
}

function jobSalary(job: JobRow): string {
    return job.minSalary || job.maxSalary
        ? `${job.minSalary || '—'} – ${job.maxSalary || '—'} ${job.salaryFrequency}`.trim()
        : '';
}

/** Ambient background shared by every state of the page. */
function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0B0B0F]">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(139,92,246,0.10),transparent_70%)]"
            />
            {children}
        </div>
    );
}

/** Spinner shown while the listing loads — also the prerender fallback. */
function LoadingView() {
    return (
        <PageShell>
            <div role="status" className="flex min-h-screen flex-col items-center justify-center gap-3">
                <Loader2 aria-hidden className="h-6 w-6 animate-spin text-gray-400" />
                <span className="text-sm text-gray-500">Loading job…</span>
            </div>
        </PageShell>
    );
}

/** Centered message card used by the not-found and error states. */
function StateMessage({
    icon,
    title,
    message,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    message: string;
    action: React.ReactNode;
}) {
    return (
        <PageShell>
            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4">
                <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-white/[0.06] bg-[#121214] px-6 py-14 text-center shadow-2xl">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.05] bg-[#18181B] text-gray-400">
                        {icon}
                    </span>
                    <h1 className="mt-5 text-lg font-semibold text-white">{title}</h1>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">{message}</p>
                    <div className="mt-6">{action}</div>
                </div>
            </div>
        </PageShell>
    );
}

function JobDetailContent() {
    const params = useParams<{ id: string }>();
    const id = typeof params.id === 'string' ? params.id : '';

    const [view, setView] = useState<View>('loading');
    const [job, setJob] = useState<JobRow | null>(null);

    // Fetches in the browser so the route keeps prerendering as a static shell.
    // No setState before the first `await`, and the microtask hop keeps the
    // setState-calling function out of the effect body
    // (`react-hooks/set-state-in-effect`) — same pattern as the manage-jobs page.
    const load = useCallback(async () => {
        setView('loading');
        if (!id) {
            setView('notFound');
            return;
        }
        try {
            setJob(await getJobById(id));
            setView('ready');
        } catch (err) {
            console.error('getJobById failed:', err);
            // `getJobById` puts the HTTP status in its message; a 404 means the
            // listing is gone, anything else is a failed request worth retrying.
            const message = err instanceof Error ? err.message : '';
            setView(message.endsWith('(404)') ? 'notFound' : 'error');
        }
    }, [id]);

    useEffect(() => {
        void Promise.resolve().then(load);
    }, [load]);

    if (view === 'loading') {
        return <LoadingView />;
    }

    if (view === 'notFound') {
        return (
            <StateMessage
                icon={<SearchX aria-hidden className="h-5 w-5" />}
                title="This job listing isn’t available"
                message="It may have been closed or the link is out of date."
                action={
                    <Link
                        href="/browse-jobs"
                        className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-md transition-colors hover:bg-gray-100"
                    >
                        Browse all jobs
                    </Link>
                }
            />
        );
    }

    if (view === 'error' || !job) {
        return (
            <StateMessage
                icon={<AlertTriangle aria-hidden className="h-5 w-5 text-amber-400" />}
                title="Couldn’t load this job"
                message="Something went wrong while fetching the listing. Please try again."
                action={
                    <button
                        onClick={() => void load()}
                        className="inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-md transition-colors hover:bg-gray-100"
                    >
                        Retry
                    </button>
                }
            />
        );
    }

    return (
        <PageShell>
            <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
                <Link
                    href="/browse-jobs"
                    className="group mb-4 inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-300"
                >
                    <ArrowLeft aria-hidden className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    Back to all jobs
                </Link>

                <JobHeaderBar title={job.title} job={job} id={id} />

                <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Overview first on mobile, right column on desktop */}
                    <aside className="lg:order-2 lg:sticky lg:top-6">
                        <JobStatsGrid
                            salary={jobSalary(job)}
                            location={jobLocation(job)}
                            type={typeLabel(job.jobType)}
                            category={job.category}
                        />
                    </aside>

                    <div className="min-w-0 lg:order-1">
                        <JobDescriptionDetail
                            responsibilities={job.responsibilities}
                            requirements={job.requirements}
                        />
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

/**
 * `useParams()` suspends during prerendering: this route's `id` isn't known
 * until request time (`cacheComponents`), so the URL data must sit behind a
 * `<Suspense>` boundary or `next build` fails with `CLIENT_HOOK_DYNAMIC`.
 * The static shell is the spinner, which is exactly what the reader sees
 * until the client-side fetch resolves.
 */
export default function BrowseJobsDetailsPage() {
    return (
        <Suspense fallback={<LoadingView />}>
            <JobDetailContent />
        </Suspense>
    );
}
