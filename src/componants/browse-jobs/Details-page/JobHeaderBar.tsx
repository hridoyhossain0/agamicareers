'use client'
import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Briefcase } from 'lucide-react';

interface JobHeaderBarProps {
    title?: string;
    company?: string;
    isVerified?: boolean;
    onApply?: () => void;
}

export default function JobHeaderBar({
    title = "Senior Product Designer",
    company = "CloudScale AI",
    isVerified = true,
    onApply
}: JobHeaderBarProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    return (
        <div className="w-full max-w-6xl mx-auto bg-[#121214] border border-white/[0.04] rounded-2xl p-4 flex items-center justify-between shadow-xl">

            {/* Left Section: Logo & Job Details */}
            <div className="flex items-center gap-4">
                {/* Company Logo Square */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-[#18181C] to-[#141416] border border-white/[0.06] flex items-center justify-center shrink-0 shadow-inner">
                    <Briefcase className="w-5 h-5 text-gray-400 opacity-80" />
                </div>

                {/* Info Column */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg md:text-xl font-semibold text-white tracking-wide leading-tight">
                        {title}
                    </h1>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 font-light">
                        <span>{company}</span>
                        {isVerified && (
                            <>
                                <span className="text-gray-600">•</span>
                                <div className="flex items-center gap-1.5 text-[#22C55E] font-medium text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 fill-[#22C55E]/10" />
                                    Verified Employer
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section: Action Elements */}
            <div className="flex items-center gap-3">
                {/* Save/Bookmark Button */}
                <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-3 rounded-xl border border-white/[0.04] bg-[#18181C] transition-all ${isBookmarked
                            ? 'text-purple-400 border-purple-500/30 bg-[#1C1625]'
                            : 'text-gray-400 hover:text-white hover:bg-[#202026]'
                        }`}
                >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>

                {/* Primary CTA Apply Now Button */}
                <button
                    onClick={onApply}
                    className="bg-white text-black hover:bg-gray-100 transition-colors px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap shadow-md"
                >
                    Apply Now
                </button>
            </div>

        </div>
    );
}
