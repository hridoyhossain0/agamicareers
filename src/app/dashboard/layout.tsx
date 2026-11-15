import { Suspense } from "react";
import { DashboardSidebar } from "@/componants/dashboardSidebar/DashboardSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

/**
 * `DashboardSidebar` reads `useSession()` / `usePathname()` — values that only
 * exist in the browser. A dynamic dashboard route (e.g. the
 * `/dashboard/[[...slug]]` catch-all) can't resolve them while prerendering,
 * so the sidebar sits behind a Suspense boundary: the layout shell (and the
 * content beside it) renders immediately, then the sidebar streams in.
 *
 * The fallback only reserves the sidebar's width on desktop; on mobile the
 * sidebar is an overlay sheet and takes no layout space.
 */
const SidebarFallback = () => (
    <div aria-hidden className="hidden md:block">
        <div className="w-(--sidebar-width)" />
    </div>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <Suspense fallback={<SidebarFallback />}>
                <DashboardSidebar />
            </Suspense>
            <SidebarInset className="bg-[#0B0B0F]">
                <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-3 border-b border-neutral-800 bg-[#0B0B0F]/95 px-4 backdrop-blur">
                    <SidebarTrigger className="text-neutral-300 hover:bg-neutral-800 hover:text-white" />
                    <span className="text-sm font-medium text-neutral-400">Dashboard</span>
                </header>
                <div className="flex-1 p-4 sm:p-6">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
