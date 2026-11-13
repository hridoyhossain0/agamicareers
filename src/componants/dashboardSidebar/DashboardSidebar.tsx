'use client'
import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { signOut, useSession } from '@/lib/auth-client';
import { cn } from 'cn';
import {
    Bookmark,
    Briefcase,
    Building2,
    CreditCard,
    FileText,
    LayoutGrid,
    LogOut,
    Settings,
    Users,
    ChevronRight,
    type LucideIcon,
} from 'lucide-react';

type Role = 'seeker' | 'recruiter' | 'admin';

type NavItem = {
    id: string;
    name: string;
    url: string;
    icon: LucideIcon;
};

/**
 * Menu items per portal.
 * TODO: replace the placeholder routes with the real pages as they are built
 * (`/dashboard/<role>/...` pages other than the dashboard home mostly don't exist yet).
 */
const NAV_ITEMS: Record<Role, NavItem[]> = {
    // Seeker Portal
    seeker: [
        { id: 'dashboard', name: 'Dashboard', url: '/dashboard/seeker', icon: LayoutGrid },
        { id: 'jobs', name: 'Jobs', url: '/browse-jobs', icon: Briefcase },
        { id: 'saved-jobs', name: 'Saved Jobs', url: '/dashboard/seeker/saved-jobs', icon: Bookmark },
        { id: 'applications', name: 'Applications', url: '/dashboard/seeker/applications', icon: FileText },
        { id: 'billing', name: 'Billing', url: '/dashboard/seeker/billing', icon: CreditCard },
        { id: 'settings', name: 'Settings', url: '/dashboard/seeker/settings', icon: Settings },
    ],
    // Recruiter portal
    recruiter: [
        { id: 'dashboard', name: 'Dashboard', url: '/dashboard/recruiter', icon: LayoutGrid },
        { id: 'manage-jobs', name: 'Manage Jobs', url: '/dashboard/recruiter/jobs', icon: Briefcase },
        { id: 'applications', name: 'Applications', url: '/dashboard/recruiter/applications', icon: FileText },
        { id: 'settings', name: 'Settings', url: '/dashboard/recruiter/settings', icon: Settings },
    ],
    // Admin console
    admin: [
        { id: 'dashboard', name: 'Dashboard', url: '/dashboard/admin', icon: LayoutGrid },
        { id: 'users', name: 'Users', url: '/dashboard/admin/users', icon: Users },
        { id: 'companies', name: 'Companies', url: '/dashboard/admin/companies', icon: Building2 },
        { id: 'jobs', name: 'Jobs', url: '/dashboard/admin/jobs', icon: Briefcase },
        { id: 'payments', name: 'Payments', url: '/dashboard/admin/payments', icon: CreditCard },
        { id: 'settings', name: 'Settings', url: '/dashboard/admin/settings', icon: Settings },
    ],
};

/** Badge/subtitle shown on the portal cards. */
const ROLE_LABEL: Record<Role, string> = {
    seeker: 'Professional Tier',
    recruiter: 'Recruiter',
    admin: 'Super Admin',
};

/** Fallback display names, used before the session loads / when signed out. */
const FALLBACK_NAME: Record<Role, string> = {
    seeker: 'Account',
    recruiter: 'Alex Sterling',
    admin: 'Alex Rivers',
};

/** better-auth's session type doesn't expose the custom `role` field yet. */
type SessionUser = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: Role;
};

function getInitials(name: string) {
    const initials = name
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
    return initials || 'U';
}

function ProfileAvatar({ src, name }: { src?: string | null; name: string }) {
    return (
        <Avatar size="lg" className="after:border-neutral-700">
            <AvatarImage src={src ?? undefined} alt={name} className="grayscale" />
            <AvatarFallback className="bg-neutral-800 text-white">{getInitials(name)}</AvatarFallback>
        </Avatar>
    );
}

export function DashboardSidebar() {
    const { data: session } = useSession();
    const pathname = usePathname() ?? '';

    const user = session?.user as SessionUser | undefined;
    const role: Role = user?.role ?? 'seeker';
    const items = NAV_ITEMS[role];

    const displayName = user?.name || user?.email || FALLBACK_NAME[role];

    // Deepest matching route wins, so `/dashboard/seeker/saved-jobs`
    // highlights "Saved Jobs" instead of also highlighting "Dashboard".
    const activeId = useMemo(() => {
        const match = items
            .filter(({ url }) => pathname === url || pathname.startsWith(`${url.replace(/\/+$/, '')}/`))
            .sort((a, b) => b.url.length - a.url.length)[0];
        return match?.id;
    }, [items, pathname]);

    const handleSignOut = async () => {
        await signOut();
    };

    const logoutButton = (
        <Button
            variant="ghost"
            size="lg"
            onClick={handleSignOut}
            className="h-10 w-full justify-start gap-3 rounded-md px-2.5 text-[13px] font-medium text-neutral-400 hover:bg-sidebar-accent hover:text-white"
        >
            <LogOut className="size-4" />
            Logout
        </Button>
    );

    return (
        <Sidebar className="border-sidebar-border">
            {/* Logo + portal header */}
            <SidebarHeader className="gap-3 p-4">
                <Link
                    href="/"
                    className="flex w-fit items-center gap-1 px-1 font-sans text-xl font-bold tracking-tight select-none"
                >
                    <span className="text-[#0070f3]">hire</span>
                    <span className="relative flex size-6 items-center justify-center mx-0.5">
                        <span className="absolute size-4 rounded-full border-2 border-[#0070f3] opacity-80 -translate-x-1"></span>
                        <span className="absolute size-4 rounded-full border-2 border-[#ff4500] opacity-80 translate-x-1"></span>
                    </span>
                    <span className="text-[#ff4500]">p</span>
                </Link>

                {/* Admin console: title under the logo, no card up top */}
                {role === 'admin' ? (
                    <p className="px-1 text-xs text-neutral-400">Admin Console</p>
                ) : null}

                {/* Seeker: portal card */}
                {role === 'seeker' ? (
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-3">
                        <ProfileAvatar src={user?.image} name={displayName} />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">Seeker Portal</p>
                            <p className="truncate text-xs text-neutral-400">{ROLE_LABEL.seeker}</p>
                        </div>
                    </div>
                ) : null}

                {/* Recruiter: card with name, role and "Premium account" pill */}
                {role === 'recruiter' ? (
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-3">
                        <ProfileAvatar src={user?.image} name={displayName} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-neutral-400">{ROLE_LABEL.recruiter}</p>
                                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                                    Premium account
                                    <ChevronRight className="size-3" />
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="gap-1">
                        {items.map((item) => {
                            const isActive = activeId === item.id;

                            return (
                                <SidebarMenuItem
                                    key={item.id}
                                    className={cn(
                                        isActive &&
                                            "before:absolute before:-left-2 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded-r-sm before:bg-white before:content-['']"
                                    )}
                                >
                                    <SidebarMenuButton
                                        render={<Link href={item.url} />}
                                        isActive={isActive}
                                        tooltip={{ children: item.name, className: 'bg-neutral-800 text-white' }}
                                        className={cn(
                                            'h-9 gap-3 rounded-md px-2.5 text-[13px] text-neutral-400',
                                            isActive
                                                ? 'bg-sidebar-accent font-medium text-white'
                                                : 'hover:bg-sidebar-accent hover:text-white'
                                        )}
                                    >
                                        <item.icon className="size-4 shrink-0" />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer: seeker posts a resume, admin shows the account card, everyone logs out */}
            <SidebarFooter className="gap-2 p-4">
                {role === 'seeker' ? (
                    <Button
                        render={<Link href={`/dashboard/${role}/post-resume`} />}
                        nativeButton={false}
                        size="lg"
                        className="h-10 w-full rounded-lg bg-white text-[13px] font-semibold text-neutral-900 shadow-sm hover:bg-neutral-200"
                    >
                        Post Resume
                    </Button>
                ) : null}

                {role === 'admin' ? (
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-3">
                        <ProfileAvatar src={user?.image} name={displayName} />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                            <span className="mt-1 inline-flex w-fit items-center rounded-full border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-300">
                                {ROLE_LABEL.admin}
                            </span>
                        </div>
                    </div>
                ) : null}

                {logoutButton}
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
