'use client'
import React, { useState } from 'react';
import { Bookmark, DollarSign, Clock, Zap, ChevronDown, Check } from 'lucide-react';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    isEasyApply: boolean;
    logoUrl?: string;
}

export default function JobResults() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['Full-time']);

    const filterOptions = [
        { label: 'Full-time', count: '1.2k' },
        { label: 'Contract', count: '432' },
        { label: 'Freelance', count: '156' },
    ];

    const dummyJobs: Job[] = [
        {
            id: '1',
            title: 'Senior Product Designer',
            company: 'TechFlow Systems',
            location: 'San Francisco, CA (Remote)',
            salary: '$140k - $180k',
            type: 'Full-time',
            isEasyApply: true,
        },
        {
            id: '2',
            title: 'Lead Frontend Engineer',
            company: 'TechFlow Systems',
            location: 'New York, NY (Hybrid)',
            salary: '$150k - $190k',
            type: 'Full-time',
            isEasyApply: false,
        }
    ];

    const toggleFilter = (label: string) => {
        setSelectedFilters(prev =>
            prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
        );
    };

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
                                const isChecked = selectedFilters.includes(option.label);
                                return (
                                    <label
                                        key={option.label}
                                        className="flex items-center justify-between cursor-pointer group text-sm select-none"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => toggleFilter(option.label)}
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
                            Found <span className="font-semibold text-white">1,248</span> Professional Jobs
                        </h1>

                        <div className="flex items-center gap-2 text-xs md:text-sm">
                            <span className="text-gray-500">Sort by:</span>
                            <button className="bg-[#121214] border border-white/[0.04] hover:border-white/[0.08] transition-colors px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium text-gray-200">
                                Most Recent
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Job Cards List */}
                    <div className="space-y-4 w-full">
                        {dummyJobs.map((job) => (
                            <div
                                key={job.id}
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
                                        <button className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg">
                                            <Bookmark className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="text-xs md:text-sm text-gray-400 font-light mb-4">
                                        {job.company} • <span className="text-gray-500">{job.location}</span>
                                    </p>

                                    {/* Attribute Chips */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 bg-[#18181B] text-gray-400 border border-white/[0.04] px-2.5 py-1 rounded-md text-xs font-medium">
                                            <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                                            {job.salary}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-[#18181B] text-gray-400 border border-white/[0.04] px-2.5 py-1 rounded-md text-xs font-medium">
                                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                                            {job.type}
                                        </span>
                                        {job.isEasyApply && (
                                            <span className="inline-flex items-center gap-1 bg-[#14241C] text-[#4ADE80] border border-[#22C55E]/20 px-2.5 py-1 rounded-md text-xs font-semibold">
                                                <Zap className="w-3.5 h-3.5 fill-current" />
                                                Easy Apply
                                            </span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                </main>
            </div>
        </section>
    );
}
