'use client'
import React, { useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Briefcase, DollarSign, CalendarDays, Wifi, ChevronDown, X } from 'lucide-react';

import {
    SALARY_RANGES,
    buildBrowseSearchParams,
    hasBrowseFilters,
    parseBrowseFilters,
    salaryRangeValue,
    type BrowseFilters,
} from '@/lib/browse-jobs-params';
import { JOB_TYPES, type JobType } from '@/lib/types/jobs';

/** "full-time" → "Full-time" (same formatting as the listings + manage table). */
const typeLabel = (jobType: string) => jobType.charAt(0).toUpperCase() + jobType.slice(1);

/** Dropdown choices — job types mirror the sidebar in JobResults. */
interface FilterOption {
    value: string;
    label: string;
}

const JOB_TYPE_OPTIONS: FilterOption[] = JOB_TYPES.map((type) => ({
    value: type,
    label: typeLabel(type),
}));

const POSTED_OPTIONS: FilterOption[] = [
    { value: '24h', label: 'Past 24 hours' },
    { value: 'week', label: 'Past week' },
    { value: 'month', label: 'Past month' },
];

const SALARY_OPTIONS: FilterOption[] = SALARY_RANGES.filter((range) => range.value !== '').map(
    (range) => ({ value: range.value, label: range.label }),
);

const SELECT_CLASS =
    'appearance-none bg-[#18181C] border border-white/[0.03] rounded-xl pl-10 pr-9 py-3 text-sm font-light text-gray-200 ' +
    'focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer hover:border-white/[0.08] ' +
    'placeholder-gray-600';

/** Shared shell for the compact filter dropdowns in the second row. */
function FilterSelect({
    value,
    onChange,
    options,
    icon: Icon,
    ariaLabel,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    icon: React.ComponentType<{ className?: string }>;
    ariaLabel: string;
    /** Label for the empty ("no filter") option. */
    placeholder: string;
}) {
    return (
        <div className="relative flex-1 min-w-[10.5rem]">
            <Icon className="w-4 h-4 text-gray-500 shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
                aria-label={ariaLabel}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${SELECT_CLASS} w-full`}
            >
                <option value="" className="bg-[#18181C] text-gray-200">
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#18181C] text-gray-200">
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    );
}

export default function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const formRef = useRef<HTMLFormElement>(null);

    // The URL is the single source of truth for every committed filter.
    const filters = parseBrowseFilters(searchParams);

    /** Current (possibly not-yet-submitted) keywords/location, straight from the form. */
    const readTextFields = () => {
        const data = formRef.current ? new FormData(formRef.current) : null;
        return {
            q: String(data?.get('q') ?? filters.q).trim(),
            location: String(data?.get('location') ?? filters.location).trim(),
        };
    };

    /** Push the full filter set to the URL — one navigation, no stale params. */
    const applyFilters = (changes: Partial<BrowseFilters> = {}) => {
        const next: BrowseFilters = { ...filters, ...readTextFields(), ...changes };
        const query = buildBrowseSearchParams(next).toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const handleSalaryChange = (value: string) => {
        const range = SALARY_RANGES.find((option) => option.value === value);
        applyFilters({
            salaryMin: range?.min ?? null,
            salaryMax: range?.max ?? null,
        });
    };

    const handleJobTypeChange = (value: string) => {
        applyFilters({ types: value ? [value as JobType] : [] });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    /** Drop every filter — the inputs remount from the now-empty URL via their keys. */
    const clearFilters = () => router.push(pathname, { scroll: false });

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full max-w-6xl mx-auto bg-[#121214] border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-3 shadow-xl"
        >
            {/* Search Row */}
            <div className="flex items-center gap-4">
                {/* Input Field Container */}
                <div className="flex items-center gap-3 flex-1 bg-[#18181C] border border-white/[0.03] rounded-xl px-4 py-3 focus-within:border-purple-500/50 transition-colors">
                    <Search className="w-5 h-5 text-gray-500 shrink-0" />
                    <input
                        type="text"
                        name="q"
                        key={`q:${filters.q}`}
                        defaultValue={filters.q}
                        placeholder="Search by job title, keywords..."
                        className="bg-transparent w-full text-sm font-light text-white focus:outline-none placeholder-gray-600"
                    />
                </div>

                {/* Action Button */}
                <button
                    type="submit"
                    className="bg-white text-black hover:bg-gray-100 transition-colors px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap shadow-md"
                >
                    Search Jobs
                </button>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Location */}
                <div className="relative flex-1 min-w-[10.5rem]">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        name="location"
                        aria-label="Location"
                        key={`location:${filters.location}`}
                        defaultValue={filters.location}
                        placeholder="Location"
                        className={`${SELECT_CLASS} w-full`}
                    />
                </div>

                <FilterSelect
                    value={filters.types.length === 1 ? filters.types[0] : ''}
                    onChange={handleJobTypeChange}
                    options={JOB_TYPE_OPTIONS}
                    icon={Briefcase}
                    ariaLabel="Job type"
                    placeholder={filters.types.length > 1 ? 'Multiple types' : 'Any job type'}
                />

                <FilterSelect
                    value={salaryRangeValue(filters)}
                    onChange={handleSalaryChange}
                    options={SALARY_OPTIONS}
                    icon={DollarSign}
                    ariaLabel="Salary range"
                    placeholder="Any salary"
                />

                <FilterSelect
                    value={filters.posted}
                    onChange={(value) => applyFilters({ posted: value as BrowseFilters['posted'] })}
                    options={POSTED_OPTIONS}
                    icon={CalendarDays}
                    ariaLabel="Date posted"
                    placeholder="Any time"
                />

                {/* Remote-only toggle */}
                <button
                    type="button"
                    role="switch"
                    aria-checked={filters.remoteOnly}
                    onClick={() => applyFilters({ remoteOnly: !filters.remoteOnly })}
                    className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-light transition-colors ${filters.remoteOnly
                        ? 'bg-purple-500/15 border-purple-500/50 text-purple-300'
                        : 'bg-[#18181C] border-white/[0.03] text-gray-400 hover:border-white/[0.08]'
                        }`}
                >
                    <Wifi className="w-4 h-4 shrink-0" />
                    Remote only
                </button>

                {/* Clear filters */}
                {hasBrowseFilters(filters) && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        aria-label="Clear filters"
                        className="flex items-center gap-1.5 border border-white/[0.08] bg-transparent hover:border-white/[0.16] transition-colors rounded-xl px-3.5 py-3 text-sm font-light text-gray-400 hover:text-gray-200"
                    >
                        <X className="w-4 h-4 shrink-0" />
                        Clear
                    </button>
                )}
            </div>
        </form>
    );
}
