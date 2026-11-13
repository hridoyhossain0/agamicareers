import React from 'react';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

interface SuccessModalProps {
    amount?: string;
    sessionId?: string;
    onDashboardClick?: () => void;
}

export default function PaymentSuccessDialog({
    amount = "$20.00",
    sessionId = "cs_test_a1046jTBJC1Ox9D...",
    onDashboardClick
}: SuccessModalProps) {
    return (
        <Dialog>
            {/* Trigger Button - Place this wherever you launch the confirmation from */}
            {/* base-ui uses `render` instead of Radix's `asChild`. */}
            <DialogTrigger render={<button />}>
                Pay
            </DialogTrigger>

            {/* Modal Dialog Body Content Frame */}
            <DialogContent className="sm:max-w-md bg-[#121214] border border-white/[0.04] p-8 text-center text-white rounded-2xl shadow-2xl flex flex-col items-center gap-0">

                {/* Animated Checkmark Circle Graphic */}
                <div className="w-16 h-16 rounded-full bg-[#14241C] border border-[#22C55E]/10 flex items-center justify-center mb-6 shadow-inner animate-in zoom-in-50 duration-300">
                    <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-black">
                        <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                </div>

                {/* Small Highlight Status Chip */}
                <span className="bg-[#1C1D2A] text-blue-400 border border-blue-900/30 rounded-full px-3 py-1 text-[10px] font-bold font-mono tracking-wider uppercase mb-5">
                    Upgrade Successful
                </span>

                {/* Core Main Headers */}
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-4">
                    Welcome to Hireloop Pro
                </h2>

                {/* Informative Body Text Description Block */}
                <p className="text-gray-400 text-sm font-light leading-relaxed max-w-sm mb-3">
                    Your payment of <span className="font-semibold text-white">{amount}</span> was received perfectly.
                </p>

                <p className="text-gray-400 text-xs font-light leading-relaxed max-w-xs mb-8">
                    All advanced premium recruiting modules are unlocked on your account.{" "}
                    <span className="text-[#4ADE80] font-medium">
                        You may need to re-authenticate to see the effect.
                    </span>
                </p>

                {/* Secure Transaction Verification Session Token Field */}
                <div className="w-full bg-[#18181B]/50 border border-white/[0.04] rounded-xl p-3 flex items-center justify-between text-xs mb-8 gap-3 font-light">
                    <div className="flex items-center gap-2 text-gray-400">
                        <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0" />
                        <span>Session ID Verified</span>
                    </div>
                    <code className="text-gray-500 font-mono tracking-tight bg-[#141417] px-2.5 py-1 rounded border border-white/[0.02] max-w-[150px] truncate select-all">
                        {sessionId}
                    </code>
                </div>

                {/* Primary Redirect Forward Action Control Navigation Button */}
                <button
                    onClick={onDashboardClick}
                    className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xl group active:scale-[0.99]"
                >
                    Go to Workspace Dashboard
                    <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                </button>

            </DialogContent>
        </Dialog>
    );
}
