import React from 'react';
import { ExternalLink } from 'lucide-react';

interface CompanyOverviewProps {
    size?: string;
    industry?: string;
    websiteUrl?: string;
    imageUrl?: string;
}

export default function CompanyOverview({
    size = "250 - 500 Employees",
    industry = "SaaS / Artificial Intelligence",
    websiteUrl = "#",
    imageUrl = "https://unsplash.com"
}: CompanyOverviewProps) {
    return (
        <div className="w-full max-w-sm bg-[#121214] border border-white/[0.04] rounded-2xl p-6 text-left shadow-xl text-white">

            {/* Title */}
            <h3 className="text-base md:text-lg font-semibold tracking-wide mb-5">
                Company Overview
            </h3>

            {/* Featured Image Panel */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.04] bg-[#18181C] mb-6 group">
                <img
                    src={imageUrl}
                    alt="Company Workspace"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                {/* Subtle Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214]/50 to-transparent pointer-events-none" />
            </div>

            {/* Stats Key-Value Rows */}
            <div className="space-y-4 mb-6">

                {/* Size Row */}
                <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Size
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                        {size}
                    </span>
                </div>

                {/* Industry Row */}
                <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Industry
                    </span>
                    <span className="text-sm font-medium text-gray-300 text-right max-w-[200px] truncate">
                        {industry}
                    </span>
                </div>

            </div>

            {/* Primary Link Button Action */}
            <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#222226] text-gray-200 hover:text-white hover:bg-[#2A2A2E] border border-white/5 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 group"
            >
                Visit Website
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </a>

        </div>
    );
}
