'use client'
import CurrencyCheckout from '@/componants/checkout/CurrencyCheckout';
import JobNavbar from '@/componants/checkout/JobNavBar';
import StripePaymentForm from '@/componants/checkout/StripePaymentForm';
import React from 'react';

const CheckOutPage = () => {

  

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col">
            {/* Global Sandbox Navigation Bar Header */}
            <JobNavbar tagText="SANDBOX" />

            {/* Main Structural Core Grid Panel */}
            <main className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start px-4 py-12 md:py-16">

                {/* Left Hand: Invoice / Currency Summary Details (Stays floating as you scroll) */}
                <div className="md:col-span-2 w-full flex flex-col gap-6 md:sticky md:top-8 order-2 md:order-none">
                    <div className="bg-[#121214]/40 border border-white/[0.02] rounded-2xl p-2 backdrop-blur-sm">
                        <CurrencyCheckout />
                    </div>
                </div>

                {/* Right Hand: Core Card input Submission Secure Payment Form Elements */}
                <div className="md:col-span-3 w-full flex flex-col gap-6 order-1 md:order-none">
                    <div className="bg-[#121214]/20 border border-white/[0.02] rounded-2xl p-2 backdrop-blur-sm">
                        <StripePaymentForm />
                    </div>
                </div>
              

            </main>
        </div>
    );
};

export default CheckOutPage;