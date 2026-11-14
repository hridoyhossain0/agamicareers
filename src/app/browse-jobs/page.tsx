import JobResults from '@/componants/browse-jobs/JobResults';
import SearchBar from '@/componants/browse-jobs/SearchBar';
import React, { Suspense } from 'react';

/** Same card dimensions as the real SearchBar, so the header doesn't jump. */
function SearchBarFallback() {
    return (
        <div className="w-full max-w-6xl mx-auto bg-[#121214] border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
            <div className="h-11 rounded-xl bg-white/[0.04] animate-pulse" />
            <div className="h-11 rounded-xl bg-white/[0.03] animate-pulse" />
        </div>
    );
}

/** Mirrors the results layout (sidebar + card skeleton) during prerender. */
function JobResultsFallback() {
    return (
        <section className="bg-[#0B0B0F] text-white min-h-screen py-12 px-4">
            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-64 h-64 rounded-2xl bg-[#121214] border border-white/[0.04] animate-pulse" />
                <div className="flex-1 w-full space-y-4">
                    <div className="h-5 w-56 rounded bg-white/[0.06] animate-pulse" />
                    {Array.from({ length: 3 }, (_, index) => (
                        <div
                            key={index}
                            className="h-28 rounded-2xl bg-[#121214] border border-white/[0.04] animate-pulse"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

const BrowseJobsPage = () => {
    return (
        <div className='bg-[#0B0B0F]'>
            <Suspense fallback={<SearchBarFallback />}>
                <SearchBar />
            </Suspense>
            <Suspense fallback={<JobResultsFallback />}>
                <JobResults />
            </Suspense>
        </div>
    );
};

export default BrowseJobsPage;
