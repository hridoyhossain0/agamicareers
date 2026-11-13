'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';


export default function NavBar() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    // On dashboard routes the fixed sidebar covers the left 256px at md+, so
    // the full link row is only shown from lg (where it fits beside the
    // sidebar); below that the hamburger menu is used instead.
    const pathname = usePathname() ?? '';
    const onDashboard = pathname.startsWith('/dashboard');
    // better-auth's session type doesn't expose the custom `role` field yet.
    const role = (session?.user as { role?: string } | undefined)?.role || 'seeker';
    const NAV_LINKS = [
    { href: '/browse-jobs', label: 'Browse Jobs' },
    { href: '/company', label: 'Company' },
    { href: '/pricing', label: 'Pricing' },
    { href: `/dashboard/${role}`, label: 'Dashboard' },
];


    const handleSignOut = async () => {
        setMenuOpen(false);
        await signOut();
    };

    const logo = (
        <Link
            href="/"
            className="flex items-center gap-1 font-sans text-xl font-bold select-none tracking-tight"
        >
            <span className="text-[#0070f3]">hire</span>
            {/* Custom overlapping infinite/loop visual representation */}
            <span className="relative flex items-center justify-center w-6 h-6 mx-0.5">
                <span className="absolute w-4 h-4 rounded-full border-2 border-[#0070f3] opacity-80 -translate-x-1"></span>
                <span className="absolute w-4 h-4 rounded-full border-2 border-[#ff4500] opacity-80 translate-x-1"></span>
            </span>
            <span className="text-[#ff4500]">p</span>
        </Link>
    );

    const navLinks = NAV_LINKS.map(({ href, label }) => (
        <Link
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            className="hover:text-white transition-colors"
        >
            {label}
        </Link>
    ));

    const actions = (
        <div className="flex items-center gap-4">
            {session?.user ? (
                <>
                    <span className="text-blue-300">
                        <Avatar>
                            <AvatarImage
                                src={session?.user?.image || 'https://github.com/shadcn.png'}
                                alt="avator"
                                className="grayscale"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </span>
                    <button
                        onClick={handleSignOut}
                        className="text-sm font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors"
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <>
                    <Link
                        href="/sign-in"
                        onClick={() => setMenuOpen(false)}
                        className="text-sm font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/sign-up"
                        onClick={() => setMenuOpen(false)}
                        className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all transform active:scale-95"
                    >
                        Get Started
                    </Link>
                </>
            )}
        </div>
    );

    return (
        <nav className="w-full bg-[#121212] px-4 sm:px-6 py-4 border-b border-neutral-800">
            <div className="flex items-center justify-between gap-4">
                {/* Logo Area */}
                {logo}

                {/* Desktop Navigation & Actions */}
                <div className={cn('hidden items-center gap-8', onDashboard ? 'lg:flex' : 'md:flex')}>
                    <div className="flex items-center gap-6 text-sm text-neutral-400 font-medium">
                        {navLinks}
                    </div>

                    {/* Divider */}
                    <div className="h-4 w-[1px] bg-neutral-800" />

                    {/* Action Buttons */}
                    {actions}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    className={cn(
                        'inline-flex items-center justify-center rounded-lg border border-neutral-800 p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors',
                        onDashboard ? 'lg:hidden' : 'md:hidden',
                    )}
                >
                    <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        {menuOpen ? (
                            <>
                                <path d="M6 6l12 12" />
                                <path d="M18 6L6 18" />
                            </>
                        ) : (
                            <>
                                <path d="M4 7h16" />
                                <path d="M4 12h16" />
                                <path d="M4 17h16" />
                            </>
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen ? (
                <div
                    id="mobile-menu"
                    className={cn(
                        'mt-4 flex flex-col gap-4 border-t border-neutral-800 pt-4',
                        onDashboard ? 'lg:hidden md:pl-64' : 'md:hidden',
                    )}
                >
                    <div className="flex flex-col gap-4 text-sm text-neutral-400 font-medium">
                        {navLinks}
                    </div>

                    <div className="h-[1px] w-full bg-neutral-800" />

                    <div className="flex flex-wrap items-center gap-4">{actions}</div>
                </div>
            ) : null}
        </nav>
    );
}
