'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from '@/lib/auth-client';
import Link from 'next/link';
import React from 'react';

export default function NavBar() {
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut()
    }
    return (
        <nav className="w-full bg-[#121212] px-6 py-4 flex items-center justify-between border-b border-neutral-800">
            {/* Logo Area */}
            <div className="flex items-center gap-1 font-sans text-xl font-bold select-none tracking-tight">
                <span className="text-[#0070f3]">hire</span>
                {/* Custom overlapping infinite/loop visual representation */}
                <span className="relative flex items-center justify-center w-6 h-6 mx-0.5">
                    <span className="absolute w-4 h-4 rounded-full border-2 border-[#0070f3] opacity-80 -translate-x-1"></span>
                    <span className="absolute w-4 h-4 rounded-full border-2 border-[#ff4500] opacity-80 translate-x-1"></span>
                </span>
                <span className="text-[#ff4500]">p</span>
            </div>

            {/* Navigation & Actions */}
            <div className="flex items-center gap-8">
                {/* Nav Links */}
                <div className="flex items-center gap-6 text-sm text-neutral-400 font-medium">
                    <a href="/browse-jobs" className="hover:text-white transition-colors">
                        Browse Jobs
                    </a>
                    <a href="/company" className="hover:text-white transition-colors">
                        Company
                    </a>
                    <a href="/pricing" className="hover:text-white transition-colors">
                        Pricing
                    </a>
                </div>

                {/* Divider */}
                <div className="h-4 w-[1px] bg-neutral-800" />

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    {session?.user ? <> <span className='text-blue-300'><Avatar>
                        <AvatarImage
                            src={session?.user?.image || "https://github.com/shadcn.png"} 
                            alt="avator"
                            className="grayscale"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar></span>
                    
                    <button 
                        onClick={handleSignOut}  
                        className="text-sm font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors">

                        Sign Out
                    </button>
                    </> :
                        <>
                            <button>
                                <Link
                                    href="/sign-in"
                                    className="text-sm font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors"
                                >
                                    Sign In
                                </Link>
                            </button>
                            <button>
                                <Link
                                    href="/sign-up"
                                    className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all transform active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </button>
                        </>}
                </div>
            </div>
        </nav>
    );
}
