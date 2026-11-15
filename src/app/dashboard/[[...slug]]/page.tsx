import Link from 'next/link';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

/**
 * Every `/dashboard/...` URL resolves to this catch-all, so the sidebar layout
 * stays visible instead of falling through to the bare global 404. Real pages
 * added later win over it automatically.
 */
export default function DashboardPlaceholderPage() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-1">
            <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#121214] p-8 text-center shadow-xl">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                    <LayoutDashboard aria-hidden className="h-5 w-5" />
                </span>

                <h1 className="mt-5 text-lg font-semibold text-white">
                    This page is coming soon
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    We’re still building this section of the dashboard. Use the sidebar to
                    open the pages that are ready.
                </p>

                <Link
                    href="/"
                    className="group mt-6 inline-flex items-center gap-2 text-xs font-medium text-gray-400 transition-colors hover:text-white"
                >
                    <ArrowLeft
                        aria-hidden
                        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                    />
                    Back to home
                </Link>
            </div>
        </div>
    );
}
