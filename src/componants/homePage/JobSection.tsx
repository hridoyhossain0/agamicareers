import React from 'react';
import { MapPin, Briefcase, DollarSign, ArrowRight } from 'lucide-react';

interface JobCardProps {
    title: string;
    description: string;
    location: string;
    type: string;
    salary: string;
}

function JobCard({ title, description, location, type, salary }: JobCardProps) {
    return (
        <div className="bg-[#121214] border border-white/[0.04] hover:border-white/[0.08] transition-all rounded-2xl p-8 flex flex-col justify-between text-left group">
            <div>
                {/* Job Title */}
                <h3 className="text-xl font-semibold text-white mb-3">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {description}
                </p>

                {/* Info Badges/Chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <span className="inline-flex items-center gap-1.5 bg-[#1C1625] text-purple-300 border border-purple-900/30 px-3 py-1 rounded-full text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#1C1625] text-purple-300 border border-purple-900/30 px-3 py-1 rounded-full text-xs font-medium">
                        <Briefcase className="w-3.5 h-3.5" />
                        {type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#1C1625] text-purple-300 border border-purple-900/30 px-3 py-1 rounded-full text-xs font-medium w-full sm:w-auto">
                        <DollarSign className="w-3.5 h-3.5" />
                        {salary}
                    </span>
                </div>
            </div>

            {/* CTA Link */}
            <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors mt-auto w-fit"
            >
                Apply Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
        </div>
    );
}

export default function JobSection() {
    const dummyJobs = Array(6).fill({
        title: 'Frontend Developer',
        description: 'Showcase your commitment to diversity and inclusion by highlighting initiatives',
        location: 'New York, USA',
        type: 'Hybrid',
        salary: '€25-€40/hour'
    });

    return (
        <section className="bg-[#0B0B0F] text-white py-20 px-4 flex flex-col items-center">
            <div className="w-full max-w-6xl mx-auto text-center">

                {/* Section Label */}
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-purple-400 uppercase mb-4">
                    ✨ SMART JOB DISCOVERY ✨
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto mb-16 leading-tight">
                    The roles you'd never find by searching
                </h2>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {dummyJobs.map((job, index) => (
                        <JobCard
                            key={index}
                            title={job.title}
                            description={job.description}
                            location={job.location}
                            type={job.type}
                            salary={job.salary}
                        />
                    ))}
                </div>

                {/* Centered Primary Button */}
                <button className="bg-white text-black hover:bg-gray-100 transition-colors px-6 py-3 rounded-xl font-medium text-sm shadow-lg shadow-white/5">
                    View all job open
                </button>

            </div>
        </section>
    );
}
