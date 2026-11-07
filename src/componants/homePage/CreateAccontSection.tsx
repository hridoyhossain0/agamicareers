import React from 'react';

export default function CreateAccountSection() {
    return (
        <section className="relative w-full bg-[#0B0B0F] text-white pt-32 pb-40 px-4 flex flex-col items-center justify-center overflow-hidden">

            {/* Perspective Wireframe Mesh Globe/Arc Container */}
            <div className="absolute top-12 w-[180%] md:w-[130%] lg:w-[110%] aspect-[2/1] pointer-events-none select-none z-0 opacity-80">
                <div
                    className="w-full h-full rounded-full bg-gradient-to-b from-purple-600/20 via-[#0B0B0F] to-[#0B0B0F] shadow-[inset_0_40px_80px_rgba(147,51,234,0.15)] border-t border-purple-500/30"
                    style={{
                        backgroundImage: `
              radial-gradient(ellipse at top, transparent 20%, #0B0B0F 85%),
              linear-gradient(to right, rgba(147, 51, 234, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(147, 51, 234, 0.08) 1px, transparent 1px)
            `,
                        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
                        transform: 'perspective(600px) rotateX(45deg)',
                    }}
                />
            </div>

            {/* Core Typography & Actions Container */}
            <div className="relative z-10 w-full max-w-3xl mx-auto text-center flex flex-col items-center">

                {/* Core Headline */}
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 max-w-2xl leading-[1.15]">
                    Your next role is already looking for you
                </h2>

                {/* Informative Subtitle Description */}
                <p className="text-gray-400 max-w-xl text-sm md:text-base font-light tracking-wide leading-relaxed mb-10">
                    Build a profile in three minutes. The matches start arriving tomorrow morning.
                </p>

                {/* Dual Button Call-To-Actions Container */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">

                    {/* Main Primary CTA Button */}
                    <button className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 transition-colors px-7 py-3.5 rounded-xl font-semibold text-sm shadow-xl shadow-white/5 whitespace-nowrap">
                        Create a free account
                    </button>

                    {/* Secondary Action Link Button */}
                    <button className="w-full sm:w-auto bg-[#141419]/60 hover:bg-[#1E1E24]/80 text-gray-300 hover:text-white transition-all px-7 py-3.5 rounded-xl font-medium text-sm border border-white/5 whitespace-nowrap">
                        View pricing
                    </button>

                </div>

            </div>
        </section>
    );
}
