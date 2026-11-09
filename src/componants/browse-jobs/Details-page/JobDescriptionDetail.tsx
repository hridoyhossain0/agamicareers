import React from 'react';
import { Terminal, BrainCircuit, Paintbrush, Code2, ShieldAlert, DollarSign, Laptop, Compass } from 'lucide-react';

export default function JobDescriptionDetail() {
    const responsibilities = [
        'Lead the end-to-end design process for major platform features, from discovery to high-fidelity implementation.',
        'Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.',
        'Maintain and evolve our design system, ensuring consistency and accessibility across the entire product suite.',
        'Conduct user research and usability testing to validate design decisions and iterate based on feedback.'
    ];

    const skillTags = [
        { icon: Terminal, name: 'Figma Expertise' },
        { icon: BrainCircuit, name: 'System Thinking' },
        { icon: Paintbrush, name: 'UI/UX Design' },
        { icon: Code2, name: 'Basic Frontend' }
    ];

    const requirements = [
        '5+ years of experience designing complex B2B SaaS products or data-heavy applications.',
        'A strong portfolio showcasing your design process and problem-solving skills.'
    ];

    const benefits = [
        { icon: ShieldAlert, name: 'Full Health & Dental' },
        { icon: DollarSign, name: 'Competitive 401k' },
        { icon: Laptop, name: 'Latest Hardware Stipend' },
        { icon: Compass, name: 'Unlimited PTO' }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto bg-[#121214] border border-white/[0.04] rounded-2xl p-8 text-left text-white shadow-xl flex flex-col gap-10">

            {/* Job Description Block */}
            <div>
                <h2 className="text-xl font-semibold mb-4 tracking-wide">Job Description</h2>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                    At CloudScale AI, we are building the next generation of infrastructure monitoring tools. We are
                    looking for a Senior Product Designer who is passionate about translating complex technical
                    workflows into elegant, intuitive interfaces. You will be a key member of our design team,
                    working closely with engineering and product leadership to define the vision for our core
                    platform experience.
                </p>
            </div>

            {/* Responsibilities Block */}
            <div>
                <h2 className="text-xl font-semibold mb-4 tracking-wide">Responsibilities</h2>
                <ul className="space-y-4">
                    {responsibilities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed font-light">
                            <span className="text-gray-600 mt-1.5 shrink-0 text-[10px]">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Requirements Block */}
            <div>
                <h2 className="text-xl font-semibold mb-4 tracking-wide">Requirements</h2>

                {/* Skill Tags Array */}
                <div className="flex flex-wrap gap-2.5 mb-6">
                    {skillTags.map((tag, idx) => {
                        const Icon = tag.icon;
                        return (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-2 bg-[#18181C] text-gray-300 border border-white/[0.05] px-3 py-1.5 rounded-xl text-xs font-medium"
                            >
                                <Icon className="w-3.5 h-3.5 text-gray-500" />
                                {tag.name}
                            </span>
                        );
                    })}
                </div>

                {/* Text Requirements List */}
                <ul className="space-y-4">
                    {requirements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed font-light">
                            <span className="text-gray-600 mt-1.5 shrink-0 text-[10px]">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Benefits Block */}
            <div>
                <h2 className="text-xl font-semibold mb-6 tracking-wide">Benefits</h2>

                {/* 2-Column Perks Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    {benefits.map((benefit, idx) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#18181C] to-[#141416] border border-white/[0.06] flex items-center justify-center shrink-0 shadow-inner group-hover:border-purple-500/30 transition-colors">
                                    <Icon className="w-4 h-4 text-gray-400" />
                                </div>
                                <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                                    {benefit.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
