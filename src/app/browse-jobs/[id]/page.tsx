'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Loader2, SearchX } from 'lucide-react';

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

/** Spinner shown while the listing loads — also the prerender fallback. */
function LoadingView() {
    return (
        <div
            role="status"
            className="bg-[#0B0B0F] min-h-screen flex flex-col items-center justify-center gap-3"
        >
            <Loader2 aria-hidden className="w-6 h-6 animate-spin text-gray-400" />
            <span className="text-sm text-gray-500">Loading job…</span>
        </div>
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
            <div className="bg-[#0B0B0F] min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
                <span className="flex w-11 h-11 items-center justify-center rounded-full bg-[#18181B] border border-white/[0.04] text-gray-400">
                    <SearchX aria-hidden className="w-5 h-5" />
                </span>
                <h1 className="text-lg font-semibold text-white">This job listing isn’t available</h1>
                <p className="max-w-sm text-sm text-gray-500">
                    It may have been closed or the link is out of date.
                </p>
                <Link
                    href="/browse-jobs"
                    className="bg-white text-black hover:bg-gray-100 transition-colors px-5 py-2.5 rounded-xl font-medium text-sm shadow-md"
                >
                    Browse all jobs
                </Link>
            </div>
        );
    }

    if (view === 'error' || !job) {
        return (
            <div className="bg-[#0B0B0F] min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
                <AlertTriangle aria-hidden className="w-6 h-6 text-amber-400" />
                <h1 className="text-lg font-semibold text-white">Couldn’t load this job</h1>
                <p className="max-w-sm text-sm text-gray-500">
                    Something went wrong while fetching the listing. Please try again.
                </p>
                <button
                    onClick={() => void load()}
                    className="bg-white text-black hover:bg-gray-100 transition-colors px-5 py-2.5 rounded-xl font-medium text-sm shadow-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#0B0B0F] min-h-screen pb-12">
            <JobHeaderBar title={job.title} company={job.companyName} />

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 gap-6 items-start px-4 pt-8">
                <JobStatsGrid
                    salary={jobSalary(job)}
                    location={jobLocation(job)}
                    type={typeLabel(job.jobType)}
                    category={job.category}
                />
                <JobDescriptionDetail
                    responsibilities={job.responsibilities}
                    requirements={job.requirements}
                />
            </div>
        </div>
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
