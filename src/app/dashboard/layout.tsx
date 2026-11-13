import { DashboardSidebar } from "@/componants/dashboardSidebar/DashboardSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
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
