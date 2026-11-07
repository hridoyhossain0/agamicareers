import React from 'react';
import { Search, LineChart, Building2, Bookmark, MousePointerClick, FileText, Hexagon, TrendingUp } from 'lucide-react';

interface FeatureItemProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
    return (
        <div className="flex items-start gap-4 text-left p-2">
            {/* Icon Box Container */}
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-b from-[#16161A] to-[#0E0E12] border border-white/[0.08] relative group shrink-0 shadow-inner">
                {/* Subtle purple interior glow on the icon */}
                <Icon className="w-5 h-5 text-purple-400/80 group-hover:text-purple-300 transition-colors" />
            </div>

            {/* Text Details */}
            <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-white tracking-wide">
                    {title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-[220px]">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function Feature() {
    const features = [
        {
            icon: Search,
            title: 'Smart Search',
            description: 'Find your ideal job with advanced filters.'
        },
        {
            icon: LineChart,
            title: 'Salary Insights',
            description: 'Get real salary data to negotiate confidently.'
        },
        {
            icon: Building2,
            title: 'Top Companies',
            description: 'Apply to vetted companies that are hiring.'
        },
        {
            icon: Bookmark,
            title: 'Saved Jobs',
            description: 'Manage apps & favorites on your dashboard.'
        },
        {
            icon: MousePointerClick,
            title: 'One-Click Apply',
            description: 'Simplify your job applications for an easier process!'
        },
        {
            icon: FileText,
            title: 'Resume Builder',
            description: 'Create professional resumes with modern templates.'
        },
        {
            icon: Hexagon,
            title: 'Skill-Based Matching',
            description: 'Discover jobs that match your skills and experience.'
        },
        {
            icon: TrendingUp,
            title: 'Career Growth Resources',
            description: 'Boost your career with quick interview tips.'
        }
    ];

    return (
        <section className="bg-[#0B0B0F] text-white py-24 px-4 flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-6xl mx-auto text-center">

                {/* Section Label Tag */}
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-purple-400 uppercase mb-4">
                    ▪ FEATURES JOB ▪
                </div>

                {/* Core Heading */}
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white max-w-xl mx-auto mb-20 leading-tight">
                    Everything you need to succeed
                </h2>

                {/* 4-Column Responsive Grid Arrangement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 px-2 md:px-6">
                    {features.map((feature, index) => (
                        <FeatureItem
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
