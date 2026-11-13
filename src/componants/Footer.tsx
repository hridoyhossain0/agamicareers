import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full bg-black text-[#555555] font-sans px-4 sm:px-6 md:px-8 py-10 sm:py-12 flex flex-col justify-between md:min-h-[350px]">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-4 max-w-7xl w-full mx-auto">

                {/* Left Side: Brand & Description */}
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    {/* Logo */}
                    <div className="flex items-center gap-1 font-sans text-xl font-bold select-none tracking-tight">
                        <span className="text-[#0070f3]">hire</span>
                        <span className="relative flex items-center justify-center w-6 h-6 mx-0.5">
                            <span className="absolute w-4 h-4 rounded-full border-2 border-[#0070f3] opacity-80 -translate-x-1"></span>
                            <span className="absolute w-4 h-4 rounded-full border-2 border-[#ff4500] opacity-80 translate-x-1"></span>
                        </span>
                        <span className="text-[#ff4500]">p</span>
                    </div>
                    {/* Description */}
                    <p className="text-sm leading-relaxed text-[#444444]">
                        The AI-native career platform. Built for people who take their work seriously.
                    </p>
                </div>

                {/* Right Side: Links Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-20 w-full">
                    {/* Product Column */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-medium text-[#4f46e5] tracking-wide mb-1">Product</h4>
                        <a href="#job-discovery" className="text-sm hover:text-neutral-300 transition-colors">Job discovery</a>
                        <a href="#worker-ai" className="text-sm hover:text-neutral-300 transition-colors">Worker AI</a>
                        <a href="#companies" className="text-sm hover:text-neutral-300 transition-colors">Companies</a>
                        <a href="#salary-data" className="text-sm hover:text-neutral-300 transition-colors">Salary data</a>
                    </div>

                    {/* Navigations Column */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-medium text-[#4f46e5] tracking-wide mb-1">Navigations</h4>
                        <a href="#help-center" className="text-sm hover:text-neutral-300 transition-colors">Help center</a>
                        <a href="#career-library" className="text-sm hover:text-neutral-300 transition-colors">Career library</a>
                        <a href="#contact" className="text-sm hover:text-neutral-300 transition-colors">Contact</a>
                    </div>

                    {/* Resources Column */}
                    <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
                        <h4 className="text-sm font-medium text-[#4f46e5] tracking-wide mb-1">Resources</h4>
                        <a href="#brand-guideline" className="text-sm hover:text-neutral-300 transition-colors">Brand Guideline</a>
                        <a href="#newsroom" className="text-sm hover:text-neutral-300 transition-colors">Newsroom</a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl w-full mx-auto pt-8 mt-8 sm:pt-10 sm:mt-10 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">

                {/* Social Icons */}
                <div className="flex items-center gap-3">
                    {/* Facebook */}
                    <a href="#facebook" className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-4 1.6-4 3.5V8z" />
                        </svg>
                    </a>
                    {/* Pinterest/Custom Styled Button */}
                    <a href="#pinterest" className="w-8 h-8 rounded-lg bg-[#2e2b70] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.23 2.63 7.85 6.39 9.34-.1-.79-.19-2.02.04-2.9.21-.79 1.36-5.77 1.36-5.77s-.35-.69-.35-1.72c0-1.61.93-2.81 2.09-2.81 1 0 1.47.74 1.47 1.64 0 1-.63 2.5-1 3.89-.27 1.15.57 2.09 1.7 2.09 2.04 0 3.61-2.15 3.61-5.26 0-2.75-1.98-4.67-4.8-4.67-3.27 0-5.19 2.45-5.19 4.99 0 .99.38 2.05.86 2.63.09.11.11.21.08.33-.09.37-.29 1.18-.33 1.35-.05.23-.18.28-.41.17-1.53-.71-2.48-2.95-2.48-4.75 0-3.87 2.81-7.43 8.11-7.43 4.26 0 7.57 3.04 7.57 7.09 0 4.23-2.67 7.64-6.38 7.64-1.25 0-2.42-.65-2.82-1.42l-.77 2.92c-.28 1.07-1.03 2.41-1.54 3.24C10.16 21.78 11.06 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                        </svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#linkedin" className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                    </a>
                </div>

                {/* Legal & Copyright */}
                <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-light text-[#444444]">
                    <span>Copyright 2026 —Programming Hero</span>
                    <div className="hidden sm:block h-3 w-[1px] bg-neutral-900" />
                    <div className="flex gap-3">
                        <a href="#terms" className="hover:text-neutral-400 transition-colors">Terms & Policy</a>
                        <span>-</span>
                        <a href="#privacy" className="hover:text-neutral-400 transition-colors">Privacy Guideline</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
