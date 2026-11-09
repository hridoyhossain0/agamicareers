'use client'
import React, { useState } from 'react';
import { CreditCard, Check, Clock, ChevronDown } from 'lucide-react';
import PaymentSuccessDialog from './PaymentSuccessDialog';

export default function StripePaymentForm() {
    const [saveInfo, setSaveInfo] = useState(false);
    const [email, setEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [country, setCountry] = useState('Bangladesh');

    const handleDashboardRedirect = () => {
        console.log("Redirecting to dashboard area...");
        // If using Next.js routing, hook this up to: router.push('/dashboard')
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle secure form processing logic here
        console.log({ email, cardNumber, expiry, cvc, cardholderName, country, saveInfo });
    };

    return (
        <div className="w-full max-w-xl mx-auto bg-[#0B0B0F] border border-white/[0.04] rounded-2xl p-6 text-left text-white shadow-xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Link Express Checkout Button */}
                <button
                    type="button"
                    className="w-full bg-[#00D668] hover:bg-[#00C25E] text-[#0B0B0F] font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group"
                >
                    <span className="font-bold tracking-tighter text-sm italic">link</span>
                    <span className="opacity-30 text-xs">|</span>
                    <div className="flex items-center gap-1.5 text-xs bg-[#0B0B0F]/10 px-2 py-0.5 rounded font-medium">
                        <span className="font-bold italic text-blue-900 text-[10px] tracking-wide">VISA</span>
                        <span>4242</span>
                    </div>
                </button>

                {/* OR Divider Line separator */}
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/[0.06]"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-mono tracking-widest text-gray-600 uppercase">OR</span>
                    <div className="flex-grow border-t border-white/[0.06]"></div>
                </div>

                {/* Contact Information Fields */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-gray-300 tracking-wide">Contact information</h3>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 font-medium tracking-wide">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="w-full bg-[#141416] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Payment Methods Wrapper Panel */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-gray-300 tracking-wide">Payment method</h3>

                    <div className="w-full border border-white/[0.06] bg-[#141416]/50 rounded-xl overflow-hidden">
                        {/* Header Header Tab indicator */}
                        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#141416] border-b border-white/[0.06] text-xs font-medium text-gray-300">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <span>Card</span>
                        </div>

                        {/* Inner Inputs Grid section block */}
                        <div className="p-4 flex flex-col gap-4">

                            {/* Card Number Input block container */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Card Information</label>
                                <div className="relative flex items-center bg-[#141416] border border-white/[0.06] rounded-t-xl px-4 py-3 focus-within:z-10 focus-within:border-white/20 transition-all">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        placeholder="1234 1234 1234 1234"
                                        className="bg-transparent w-full text-sm text-white placeholder-gray-600 focus:outline-none"
                                        required
                                    />
                                    {/* Mock Payment Logo chips graphics icons group */}
                                    <div className="flex items-center gap-1 opacity-40 shrink-0 pointer-events-none select-none">
                                        <div className="w-5 h-3.5 bg-blue-600 rounded-sm" />
                                        <div className="w-5 h-3.5 bg-orange-500 rounded-sm" />
                                        <div className="w-5 h-3.5 bg-red-600 rounded-sm" />
                                    </div>
                                </div>

                                {/* Expiry & CVC inline layout row grid block splitting fields */}
                                <div className="grid grid-cols-2 mt-[-1px]">
                                    <div className="relative bg-[#141416] border border-white/[0.06] rounded-bl-xl px-4 py-3 focus-within:z-10 focus-within:border-white/20 transition-all">
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            placeholder="MM / YY"
                                            className="bg-transparent w-full text-sm text-white placeholder-gray-600 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="relative bg-[#141416] border-t border-b border-r border-white/[0.06] rounded-br-xl px-4 py-3 flex items-center justify-between focus-within:z-10 focus-within:border-white/20 transition-all ml-[-1px]">
                                        <input
                                            type="text"
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value)}
                                            placeholder="CVC"
                                            className="bg-transparent w-full text-sm text-white placeholder-gray-600 focus:outline-none"
                                            required
                                        />
                                        <Clock className="w-4 h-4 text-gray-600 shrink-0" />
                                    </div>
                                </div>
                            </div>

                            {/* Cardholder Name field item layout */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Cardholder name</label>
                                <input
                                    type="text"
                                    value={cardholderName}
                                    onChange={(e) => setCardholderName(e.target.value)}
                                    placeholder="Full name on card"
                                    className="w-full bg-[#141416] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all"
                                    required
                                />
                            </div>

                            {/* Country Selection fields container rows */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Country or region</label>
                                <div className="relative w-full bg-[#141416] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between text-sm text-white cursor-pointer select-none group focus-within:border-white/20">
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    >
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                    </select>
                                    <span className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-gray-500" />
                                        {country}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Save Details Checkbox toggle field row panel */}
                <div className="w-full border border-white/[0.04] bg-[#121214]/60 rounded-xl p-4 flex items-start gap-3 select-none">
                    <div
                        onClick={() => setSaveInfo(!saveInfo)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer shrink-0 mt-0.5 ${saveInfo
                            ? 'bg-white border-white text-black'
                            : 'border-white/20 bg-transparent hover:border-white/40'
                            }`}
                    >
                        {saveInfo && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex flex-col gap-0.5 cursor-pointer" onClick={() => setSaveInfo(!saveInfo)}>
                        <span className="text-xs font-semibold text-gray-200">Save my information for faster checkout</span>
                        <p className="text-[10px] text-gray-500 leading-normal font-light">
                            Pay securely on this site and everywhere Link is accepted.
                        </p>
                    </div>
                </div>

                {/* Core Submission Payment Submit Trigger button action */}
                <button
                    type="submit"
                    className="w-full bg-[#0070F3] hover:bg-[#0061D5] text-white font-semibold py-4 px-4 rounded-xl text-sm transition-all shadow-lg active:scale-[0.99] duration-700 mt-2"
                >
                    <PaymentSuccessDialog
                        amount="$20.00"
                        sessionId="cs_test_a1046jTBJC1Ox9D..."
                        onDashboardClick={handleDashboardRedirect}
                    />
                </button>


            </form>
        </div>
    );
}
