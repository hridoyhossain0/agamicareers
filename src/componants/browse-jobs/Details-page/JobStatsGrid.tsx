import React from 'react';
import { Banknote, MapPin, Clock, BarChart3, LayoutGrid } from 'lucide-react';

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
    return (
        <div className="flex flex-col gap-3 bg-[#121214] p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.05] bg-[#18181C] text-gray-400">
                <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {label}
                </dt>
                <dd className="mt-1 break-words text-sm font-semibold leading-snug text-white">
                    {value}
                </dd>
            </div>
        </div>
    );
}

/** Every value comes from the fetched job — no placeholders. */
interface JobStatsGridProps {
    /** `minSalary – maxSalary salaryFrequency`, or `''` when the posting has none. */
    salary: string;
    location: string;
    type: string;
    category: string;
}

export default function JobStatsGrid({ salary, location, type, category }: JobStatsGridProps) {
    const stats = [
        {
            icon: Banknote,
            label: 'Salary Range',
            value: salary || '—',
        },
        {
            icon: MapPin,
            label: 'Location',
            value: location || '—',
        },
        {
            icon: Clock,
            label: 'Job Type',
            value: type,
        },
        {
            icon: BarChart3,
            label: 'Category',
            value: category || '—',
        },
    ];

    return (
        <section className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121214] shadow-xl">
            <header className="flex items-center gap-2.5 border-b border-white/[0.04] px-6 py-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-[#18181C] text-gray-400">
                    <LayoutGrid aria-hidden className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-semibold tracking-wide text-white">Job Overview</h2>
            </header>

            <dl className="grid grid-cols-2 gap-px bg-white/[0.04]">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        icon={stat.icon}
                        label={stat.label}
                        value={stat.value}
                    />
                ))}
            </dl>
        </section>
    );
}
