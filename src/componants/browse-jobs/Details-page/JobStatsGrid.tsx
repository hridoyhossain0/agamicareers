import React from 'react';
import { Banknote, MapPin, Clock, BarChart3 } from 'lucide-react';

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
    return (
        <div className="bg-[#121214] border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between text-left min-w-[160px] flex-1">
            {/* Upper Section: Minimal Icon */}
            <div className="mb-4">
                <Icon className="w-5 h-5 text-gray-500" />
            </div>

            {/* Lower Section: Typography Details */}
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    {label}
                </span>
                <span className="text-sm md:text-base font-semibold text-white tracking-wide">
                    {value}
                </span>
            </div>
        </div>
    );
}

export default function JobStatsGrid() {
    const stats = [
        {
            icon: Banknote,
            label: 'Salary Range',
            value: '$140k – $180k',
        },
        {
            icon: MapPin,
            label: 'Location',
            value: 'Remote (US)',
        },
        {
            icon: Clock,
            label: 'Job Type',
            value: 'Full-time',
        },
        {
            icon: BarChart3,
            label: 'Experience',
            value: '5+ Years',
        },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0B0B0F]">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                />
            ))}
        </div>
    );
}
