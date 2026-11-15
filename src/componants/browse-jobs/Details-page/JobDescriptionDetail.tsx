import React from 'react';
import { BadgeCheck, FileText, ListChecks } from 'lucide-react';

interface JobDescriptionDetailProps {
    /** Free text typed into the create-job form. */
    responsibilities: string;
    requirements: string;
}

/** Posted text → bullet lines (blank lines dropped). */
const toBullets = (text: string) =>
    text.split('\n').map((line) => line.trim()).filter(Boolean);

function DetailBlock({
    heading,
    items,
    icon: Icon,
}: {
    heading: string;
    items: string[];
    icon: React.ComponentType<{ className?: string }>;
}) {
    if (items.length === 0) return null;

    return (
        <section>
            <div className="mb-4 flex items-center gap-2.5">
                <Icon aria-hidden className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                    {heading}
                </h3>
            </div>
            <ul className="space-y-3">
                {items.map((item, idx) => (
                    <li
                        key={idx}
                        className="flex items-start gap-3 text-sm font-light leading-relaxed text-gray-300"
                    >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400/60" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </section>
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
        <article className="rounded-3xl border border-white/[0.06] bg-[#121214] p-6 text-left text-white shadow-xl md:p-8">
            <header className="mb-8 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                    <FileText aria-hidden className="h-4 w-4" />
                </span>
                <div>
                    <h2 className="text-base font-semibold tracking-wide text-white">Job Description</h2>
                    <p className="text-xs font-light text-gray-500">Details provided by the employer.</p>
                </div>
            </header>

            <div className="space-y-10">
                <DetailBlock heading="Responsibilities" items={responsibilityItems} icon={ListChecks} />
                <DetailBlock heading="Requirements" items={requirementItems} icon={BadgeCheck} />
            </div>
        </article>
    );
}
