import React from 'react';
import { Search, MapPin, Briefcase, Building2, Users, Star } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center justify-between px-4 pt-16 pb-12 overflow-hidden">

            {/* Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Top Content Area */}
            <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center z-10">

                {/* Job Counter Badge */}
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-gray-300 mb-8 backdrop-blur-sm">
                    <span className="text-orange-400">💼</span>
                    <span className="text-white font-semibold">50,000+</span> NEW JOBS THIS MONTH
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                    Find Your Dream Job Today
                </h1>

                {/* Subtitle Description */}
                <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed mb-10">
                    HireLoop connects top talent with world-class companies. Browse thousands of
                    curated opportunities and land your next role – faster.
                </p>

                {/* Search Bar Container */}
                <div className="w-full max-w-3xl bg-[#13131A]/90 border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 backdrop-blur-md shadow-2xl shadow-purple-950/20 mb-6">

                    {/* Job/Skill Input */}
                    <div className="flex items-center gap-3 w-full px-3 py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/10">
                        <Search className="w-5 h-5 text-gray-500 shrink-0" />
                        <input
                            type="text"
                            placeholder="Job title, skill or company"
                            className="bg-transparent w-full text-sm focus:outline-none placeholder-gray-500 text-white"
                        />
                    </div>

                    {/* Location Input */}
                    <div className="flex items-center gap-3 w-full px-3 py-2 md:py-0">
                        <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                        <input
                            type="text"
                            placeholder="Location or Remote"
                            className="bg-transparent w-full text-sm focus:outline-none placeholder-gray-500 text-white"
                        />
                    </div>

                    {/* Search Button */}
                    <button className="w-full md:w-auto bg-purple-600 hover:bg-purple-500 transition-colors p-3 rounded-xl flex items-center justify-center shrink-0 group">
                        <Search className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
                    </button>
                </div>

                {/* Trending Tags */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-gray-400">
                    <span className="mr-1">Trending Position:</span>
                    {['Product Designer', 'AI Engineering', 'Dev-ops Engineer'].map((tag) => (
                        <button key={tag} className="bg-white/5 hover:bg-white/10 border border-white/5 transition-colors px-3 py-1 rounded-full text-gray-300">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Central Globe Visualization Space */}
            <div className="relative w-full max-w-4xl h-[300px] md:h-[400px] my-4 flex items-center justify-center pointer-events-none select-none">

                {/* Stylized Globe Arc */}
                <div className="absolute top-1/4 w-[160%] md:w-[120%] aspect-square rounded-full border-t border-purple-500/40 bg-gradient-to-b from-purple-950/20 via-transparent to-transparent shadow-[0_-20px_50px_rgba(147,51,234,0.15)]" />

                {/* Overlay Heading Text */}
                <h2 className="relative z-10 text-center max-w-lg text-xl md:text-3xl font-medium tracking-wide leading-snug px-4 text-gray-200">
                    Assisting over 15,000 job seekers find their dream positions.
                </h2>
            </div>

            {/* Stats Grid Footer */}
            <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 z-10">

                {/* Stat Item 1 */}
                <div className="bg-[#121218]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
                    <Briefcase className="w-5 h-5 text-gray-500 mb-6" />
                    <div>
                        <div className="text-3xl font-bold tracking-tight mb-1">50K</div>
                        <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Active Jobs</div>
                    </div>
                </div>

                {/* Stat Item 2 */}
                <div className="bg-[#121218]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
                    <Building2 className="w-5 h-5 text-gray-500 mb-6" />
                    <div>
                        <div className="text-3xl font-bold tracking-tight mb-1">12K</div>
                        <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Companies</div>
                    </div>
                </div>

                {/* Stat Item 3 */}
                <div className="bg-[#121218]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
                    <Users className="w-5 h-5 text-gray-500 mb-6" />
                    <div>
                        <div className="text-3xl font-bold tracking-tight mb-1">2M</div>
                        <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Job Seekers</div>
                    </div>
                </div>

                {/* Stat Item 4 */}
                <div className="bg-[#121218]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
                    <Star className="w-5 h-5 text-gray-500 mb-6" />
                    <div>
                        <div className="text-3xl font-bold tracking-tight mb-1">97%</div>
                        <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Satisfaction Rate</div>
                    </div>
                </div>

            </div>
        </section>
    );
}

