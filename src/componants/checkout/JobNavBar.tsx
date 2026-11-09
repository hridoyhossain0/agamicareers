import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

interface JobNavbarProps {
    onBackClick?: () => void;
    onBagClick?: () => void;
    tagText?: string;
}

export default function JobNavbar({
    onBackClick,
    onBagClick,
    tagText = "SANDBOX"
}: JobNavbarProps) {
    return (
        <header className="w-full bg-[#0B0B0F] border-b border-white/[0.04] px-4 py-3 flex items-center justify-between shadow-sm select-none">

            {/* Left side actions */}
            <div className="flex items-center gap-3">
                {/* Back navigation arrow */}
                <button
                    onClick={onBackClick}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 active:scale-95 duration-100"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5 stroke-[2]" />
                </button>

                {/* Small shopping bag container box */}
                <button
                    onClick={onBagClick}
                    className="w-10 h-10 rounded-xl bg-[#121214] border border-white/[0.06] flex items-center justify-center text-gray-300 hover:text-white hover:border-white/[0.1] transition-all shadow-inner active:scale-95 duration-100"
                    aria-label="View briefcase bag"
                >
                    <ShoppingBag className="w-4 h-4 stroke-[2]" />
                </button>
            </div>

            {/* Right side indicators */}
            <div className="flex items-center">
                {/* Environment status indicator badge */}
                <span className="bg-[#121214] text-gray-400 border border-white/[0.06] rounded-md px-2.5 py-1 text-[10px] font-bold font-mono tracking-widest uppercase shadow-sm">
                    {tagText}
                </span>
            </div>

        </header>
    );
}
