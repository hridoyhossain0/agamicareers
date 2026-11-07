'use client'
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-6xl mx-auto bg-[#121214] border border-white/[0.04] rounded-2xl p-4 flex items-center gap-4 shadow-xl"
        >
            {/* Input Field Container */}
            <div className="flex items-center gap-3 flex-1 bg-[#18181C] border border-white/[0.03] rounded-xl px-4 py-3 focus-within:border-purple-500/50 transition-colors">
                <Search className="w-5 h-5 text-gray-500 shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by job title, keywords..."
                    className="bg-transparent w-full text-sm font-light text-white focus:outline-none placeholder-gray-600"
                />
            </div>

            {/* Action Button */}
            <button
                type="submit"
                className="bg-white text-black hover:bg-gray-100 transition-colors px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap shadow-md"
            >
                Search Jobs
            </button>
        </form>
    );
}
