'use client'
import React, { useState } from 'react';
import { Crown, BarChart3, Zap, Plus, ArrowRight } from 'lucide-react';

interface PricingPlan {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    monthlyPrice: number;
    yearlyPrice: number;
    isPopular: boolean;
    features: string[];
}

export default function SubscriptionSection() {
    const [isYearly, setIsYearly] = useState(false);

    const plans: PricingPlan[] = [
        {
            name: 'Starter',
            icon: Crown,
            monthlyPrice: 0,
            yearlyPrice: 0,
            isPopular: false,
            features: [
                'Daily AI match brief (top 5)',
                'Verified salary bands',
                'Company insight dashboards',
                '1-click apply, unlimited',
            ],
        },
        {
            name: 'Growth',
            icon: BarChart3,
            monthlyPrice: 17,
            yearlyPrice: 13, // 17 * 0.75 approx with 25% discount
            isPopular: true,
            features: [
                'Daily AI match brief (top 5)',
                'Verified salary bands',
                'Company insight dashboards',
                '1-click apply, unlimited',
            ],
        },
        {
            name: 'Premium',
            icon: Zap,
            monthlyPrice: 99,
            yearlyPrice: 74, // 99 * 0.75 approx
            isPopular: false,
            features: [
                'Everything in Pro',
                'Multi-profile career portfolios',
                'Shared talent rooms',
                'Recruiter view (read-only)',
            ],
        },
    ];

    return (
        <section className="bg-[#0B0B0F] text-white py-24 px-4 flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-6xl mx-auto text-center">

                {/* Section Tag */}
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-purple-400 uppercase mb-4">
                    ▪ PRICING ▪
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white max-w-xl mx-auto mb-10 leading-tight">
                    Pay for the leverage, not the listings
                </h2>

                {/* Billing Toggle Switch */}
                <div className="inline-flex items-center bg-[#13131A] border border-white/5 p-1.5 rounded-full mb-16 relative">
                    <button
                        onClick={() => setIsYearly(false)}
                        className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${!isYearly ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsYearly(true)}
                        className={`px-5 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-all ${isYearly ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Yearly
                        <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            25%
                        </span>
                    </button>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

                        return (
                            <div
                                key={index}
                                className={`rounded-2xl p-8 flex flex-col justify-between text-left transition-all border ${plan.isPopular
                                        ? 'bg-[#15151C]/90 border-purple-500/30 shadow-[0_0_40px_rgba(147,51,234,0.1)] relative md:-translate-y-2'
                                        : 'bg-[#121214] border-white/[0.04]'
                                    }`}
                            >
                                <div>
                                    {/* Top Bar (Title & Price) */}
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-2.5">
                                            <Icon className={`w-5 h-5 ${plan.isPopular ? 'text-purple-400' : 'text-purple-400/70'}`} />
                                            <h3 className="text-xl font-semibold text-white tracking-wide">{plan.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-baseline justify-end text-white">
                                                <span className="text-3xl font-bold">$</span>
                                                <span className="text-4xl font-bold tracking-tight">{currentPrice}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">/month</span>
                                        </div>
                                    </div>

                                    {/* Feature Subheader */}
                                    <p className="text-sm font-medium text-gray-300 mb-5">
                                        Start building your insights hub:
                                    </p>

                                    {/* Feature List */}
                                    <ul className="space-y-4 mb-10">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start gap-2.5 text-xs text-gray-400 leading-normal">
                                                <Plus className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Plan Call to Action Button */}
                                <button
                                    className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 group ${plan.isPopular
                                            ? 'bg-white text-black hover:bg-gray-100 shadow-xl'
                                            : 'bg-[#222226] text-white hover:bg-[#2A2A2E] border border-white/5'
                                        }`}
                                >
                                    Choose This Plan
                                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
