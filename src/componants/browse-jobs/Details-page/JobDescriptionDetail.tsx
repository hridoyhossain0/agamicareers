import React from 'react';

interface JobDescriptionDetailProps {
    /** Free text typed into the create-job form. */
    responsibilities: string;
    requirements: string;
}

/** Posted text → bullet lines (blank lines dropped). */
const toBullets = (text: string) =>
    text.split('\n').map((line) => line.trim()).filter(Boolean);

function DetailBlock({ heading, items }: { heading: string; items: string[] }) {
    if (items.length === 0) return null;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 tracking-wide">{heading}</h2>
            <ul className="space-y-4">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed font-light">
                        <span className="text-gray-600 mt-1.5 shrink-0 text-[10px]">•</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/**
 * Rendered straight from what the poster typed. The mockup's description
 * paragraph, skill tags and Benefits block were removed — the schema has no
 * fields for them, and inventing perks for a real employer would be wrong.
 */
export default function JobDescriptionDetail({ responsibilities, requirements }: JobDescriptionDetailProps) {
    const responsibilityItems = toBullets(responsibilities);
    const requirementItems = toBullets(requirements);

    if (responsibilityItems.length === 0 && requirementItems.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto bg-[#121214] border border-white/[0.04] rounded-2xl p-8 text-left text-white shadow-xl flex flex-col gap-10">
            <DetailBlock heading="Responsibilities" items={responsibilityItems} />
            <DetailBlock heading="Requirements" items={requirementItems} />
        </div>
    );
}
