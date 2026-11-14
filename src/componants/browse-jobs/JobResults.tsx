'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Bookmark, Briefcase, ChevronDown, Check, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

import { getJobs } from '@/lib/api/jobs';
import { JOB_TYPES, type JobRow, type JobType } from '@/lib/types/jobs';
import {
    buildBrowseApiQuery,
    buildBrowseSearchParams,
    hasBrowseFilters,
    parseBrowseFilters,
} from '@/lib/browse-jobs-params';

/** Card shape — derived from a `JobRow` (see `toCardJob`). */
interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    /** `minSalary – maxSalary salaryFrequency`; empty when the posting has no range. */
    salary: string;
    type: string;
}

/** "full-time" → "Full-time" (same formatting as the manage-jobs table). */
const typeLabel = (jobType: string) => jobType.charAt(0).toUpperCase() + jobType.slice(1);

/** Map an API row to the card shape. */
function toCardJob(row: JobRow): Job {
    const location =
        row.location || (row.isRemote ? 'Remote' : '—');
    const salary =
        row.minSalary || row.maxSalary
            ? `${row.minSalary || '—'} – ${row.maxSalary || '—'} ${row.salaryFrequency}`.trim()
            : '';

    return {
        id: row._id,
        title: row.title,
        company: row.companyName,
        location: row.location && row.isRemote ? `${location} · Remote` : location,
        salary,
        type: typeLabel(row.jobType),
    };
}

export default function JobResults() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Every filter lives in the URL; this component only reads it and asks the
    // API for the matching page.
    const filters = useMemo(() => parseBrowseFilters(searchParams), [searchParams]);
    const query = useMemo(() => buildBrowseApiQuery(filters), [filters]);

    const [jobs, setJobs] = useState<Job[]>([]);
    // Unfiltered live set, used only for the sidebar counts so they don't
    // collapse to the current selection while filters are toggled.
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const requestRef = useRef<AbortController | null>(null);

    // Same shape as before: no setState before the first `await`, and the
    // microtask hop keeps the setState-calling function out of the effect body
    // (`react-hooks/set-state-in-effect`).
    const loadJobs = useCallback(
        async (signal: AbortSignal) => {
            setLoading(true);
            try {
                const rows = await getJobs(query, { signal });
                if (signal.aborted) return;
                setJobs(rows.map(toCardJob));
                setError(null);
            } catch (err) {
                if (signal.aborted) return;
                console.error('getJobs failed:', err);
                setError("We couldn't load jobs right now. Check your connection and try again.");
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        },
        [query],
    );

    useEffect(() => {
        requestRef.current?.abort();
        const controller = new AbortController();
        requestRef.current = controller;
        void Promise.resolve().then(() => loadJobs(controller.signal));
        return () => controller.abort();
    }, [loadJobs]);

    // Sidebar counts come from the unfiltered live set, fetched once on mount.
    const loadCounts = useCallback(async (signal: AbortSignal) => {
        try {
            const rows = await getJobs('status=active', { signal });
            if (!signal.aborted) setAllJobs(rows.map(toCardJob));
        } catch {
            // Counts are cosmetic — the listings themselves already handle errors.
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        void Promise.resolve().then(() => loadCounts(controller.signal));
        return () => controller.abort();
    }, [loadCounts]);

    const retry = () => {
        setLoading(true);
        setError(null);
        requestRef.current?.abort();
        const controller = new AbortController();
        requestRef.current = controller;
        void loadJobs(controller.signal);
    };

    const pushFilters = (next: typeof filters) => {
        const nextQuery = buildBrowseSearchParams(next).toString();
        router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    };

    const toggleFilter = (type: JobType) => {
        const types = filters.types.includes(type)
            ? filters.types.filter((item) => item !== type)
            : [...filters.types, type];
        pushFilters({ ...filters, types });
    };

    /** Drop every filter — the SearchBar inputs re-hydrate from the clean URL. */
    const clearFilters = () => router.push(pathname, { scroll: false });

    // Fall back to the fetched page if the count fetch failed, so the numbers
    // are never blank while results are visible.
    const countSource = allJobs.length > 0 ? allJobs : jobs;

    const filterOptions = useMemo(
        () =>
            JOB_TYPES.map((type) => ({
                type,
                label: typeLabel(type),
                count: countSource.filter((job) => job.type === typeLabel(type)).length,
            })),
        [countSource],
    );

    const hasFilters = hasBrowseFilters(filters);

    return (
        <section className="bg-[#0B0B0F] text-white min-h-screen py-12 px-4">
            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-start">

                {/* Left Column: Sidebar Filters */}
                <aside className="w-full md:w-64 bg-[#121214] border border-white/[0.04] rounded-2xl p-6 shrink-0">
                    <h2 className="text-lg font-semibold mb-6">Filters</h2>

                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Job Type</h3>
                        <div className="space-y-3">
                            {filterOptions.map((option) => {
                                const isChecked = filters.types.includes(option.type);
                                return (
                                    <label
                                        key={option.type}
                                        className="flex items-center justify-between cursor-pointer group text-sm select-none"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => toggleFilter(option.type)}
                                                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${isChecked
                                                        ? 'bg-white border-white text-black'
                                                        : 'border-white/20 bg-transparent group-hover:border-white/40'
                                                    }`}
                                            >
                                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                            </div>
                                            <span className={isChecked ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}>
                                                {option.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-600 font-mono">{option.count}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Right Column: Main Content Area */}
                <main className="flex-1 w-full flex flex-col gap-4">

                    {/* Header Bar */}
                    <div className="flex items-center justify-between mb-2 w-full">
                        <h1 className="text-base md:text-lg font-medium text-white tracking-wide">
                            Found <span className="font-semibold text-white">{jobs.length.toLocaleString()}</span> Professional Jobs
                        </h1>

                        <div className="flex items-center gap-2 text-xs md:text-sm">
                            <span className="text-gray-500">Sort by:</span>
                            <button className="bg-[#121214] border border-white/[0.04] hover:border-white/[0.08] transition-colors px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium text-gray-200">
                                Most Recent
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div role="status" className="space-y-4 w-full">
                            <span className="sr-only">Loading jobs…</span>
                            {Array.from({ length: 4 }, (_, index) => (
                                <div
                                    key={index}
                                    className="animate-pulse bg-[#121214] border border-white/[0.04] rounded-2xl p-6 flex items-start gap-4"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] shrink-0" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 w-1/2 rounded bg-white/[0.06]" />
                                        <div className="h-3 w-1/3 rounded bg-white/[0.04]" />
                                        <div className="h-5 w-44 rounded bg-white/[0.04]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center bg-[#121214] border border-white/[0.04] rounded-2xl px-6 py-14 text-center">
                            <AlertTriangle className="w-6 h-6 text-amber-400" />
                            <h2 className="mt-4 text-sm font-semibold text-white">Couldn’t load jobs</h2>
                            <p className="mt-1.5 max-w-md text-sm text-gray-500">{error}</p>
                            <button
                                onClick={retry}
                                className="mt-5 bg-white text-black hover:bg-gray-100 transition-colors px-5 py-2.5 rounded-xl font-medium text-sm shadow-md"
                            >
                                Retry
                            </button>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="flex flex-col items-center bg-[#121214] border border-white/[0.04] rounded-2xl px-6 py-14 text-center">
                            <span className="flex w-11 h-11 items-center justify-center rounded-full bg-[#18181B] border border-white/[0.04] text-gray-400">
                                <Briefcase className="w-5 h-5" />
                            </span>
                            <h2 className="mt-4 text-sm font-semibold text-white">
                                {hasFilters ? 'No jobs match your filters' : 'No jobs posted yet'}
                            </h2>
                            <p className="mt-1.5 max-w-sm text-sm text-gray-500">
                                {hasFilters
                                    ? 'Try a different job type or clear the filters to see every listing.'
                                    : 'New listings will appear here as soon as they are posted.'}
                            </p>
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-5 bg-[#18181B] border border-white/[0.08] hover:border-white/[0.16] transition-colors px-5 py-2.5 rounded-xl font-medium text-sm text-gray-200"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        /* Job Cards List */
                        <div className="space-y-4 w-full">
                            {jobs.map((job) => (
                                <Link
                                    key={job.id}
                                    href={`/browse-jobs/${job.id}`}
                                    className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:outline-none"
                                >
                                    <div
                                        className="bg-[#121214] border border-white/[0.04] hover:border-white/[0.08] transition-all rounded-2xl p-6 flex items-start gap-4 shadow-lg group relative"
                                    >
                                        {/* Mock Company Logo */}
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#18181C] to-[#141416] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                                            <div className="w-3 h-3 bg-teal-500/80 rounded-full blur-[2px]" />
                                        </div>

                                        {/* Job Metadata details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h2 className="text-base md:text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                                    {job.title}
                                                </h2>
                                                {/* Decorative (no bookmarks API yet) — a span, not a button,
                                                    so it isn't nested inside the card link. */}
                                                <span className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg">
                                                    <Bookmark aria-hidden className="w-4 h-4" />
                                                </span>
                                            </div>

                                            <p className="text-xs md:text-sm text-gray-400 font-light mb-4">
                                                {job.company} • <span className="text-gray-500">{job.location}</span>
                                            </p>

                                            {/* Attribute Chips */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                {job.salary && (
                                                    <span className="inline-flex items-center gap-1.5 bg-[#18181B] text-gray-400 border border-white/[0.04] px-2.5 py-1 rounded-md text-xs font-medium">
                                                        <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                                                        {job.salary}
                                                    </span>
                                                )}
                                                <span className="inline-flex items-center gap-1.5 bg-[#18181B] text-gray-400 border border-white/[0.04] px-2.5 py-1 rounded-md text-xs font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                                                    {job.type}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </main>
            </div>
        </section>
    );
}
