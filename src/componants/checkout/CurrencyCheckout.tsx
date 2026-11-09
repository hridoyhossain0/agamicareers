'use client'
import React, { useState } from 'react';

interface CurrencyOption {
    id: 'BDT' | 'USD';
    code: string;
    symbol: string;
    value: string;
    flagUrl: string;
}

export default function CurrencyCheckout() {
    const [selectedCurrency, setSelectedCurrency] = useState<'BDT' | 'USD'>('BDT');

    const currencies: CurrencyOption[] = [
        {
            id: 'BDT',
            code: 'BDT',
            symbol: 'BDT',
            value: '2,553.33',
            // Using SVG flag placeholders or emoji style strings
            flagUrl: '🇧🇩',
        },
        {
            id: 'USD',
            code: 'USD',
            symbol: '$',
            value: '20.00',
            flagUrl: '🇺🇸',
        },
    ];

    const activeOption = currencies.find(c => c.id === selectedCurrency)!;

    return (
        <div className="w-full max-w-xl mx-auto bg-[#0B0B0F] border border-white/[0.04] rounded-2xl p-6 text-left text-white shadow-xl">

            {/* Top Section Header */}
            <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-4">
                Choose a Currency:
            </h3>

            {/* Currency Selection Grid layout row */}
            <div className="grid grid-cols-2 gap-4 mb-3">
                {currencies.map((currency) => {
                    const isSelected = selectedCurrency === currency.id;
                    return (
                        <button
                            key={currency.id}
                            onClick={() => setSelectedCurrency(currency.id)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${isSelected
                                    ? 'border-white bg-transparent ring-1 ring-white shadow-md'
                                    : 'border-white/[0.06] bg-[#121214]/40 hover:border-white/[0.12] text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {/* Flag Badge element graphic markup */}
                            <span className="text-xl shrink-0 leading-none filter saturate-[0.85]">
                                {currency.flagUrl}
                            </span>

                            {/* Currency Output details */}
                            <span className="text-sm font-semibold tracking-wide">
                                {currency.code} {currency.value}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Exchange Conversion Conversion Text Label row */}
            <div className="text-[10px] font-mono italic text-gray-600 mb-8 px-1">
                1 USD ≈ 127.6665 BDT
            </div>

            {/* Border Divider line separator mark */}
            <div className="w-full h-px bg-white/[0.06] mb-8" />

            {/* Invoice Product Item Line Breakdown row container */}
            <div className="flex items-start justify-between gap-4 px-1">
                <div>
                    <h4 className="text-base font-semibold text-white tracking-wide mb-1">
                        Hireloop Pro Plan
                    </h4>
                    <p className="text-xs text-gray-500 font-light">
                        Access to all features
                    </p>
                </div>

                {/* Pricing Subtotal display label details */}
                <div className="text-base font-semibold text-white tracking-wide whitespace-nowrap">
                    {activeOption.symbol} {activeOption.value}
                </div>
            </div>

        </div>
    );
}
