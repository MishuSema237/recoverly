'use client';

import React from 'react';
import { FileText, Gavel, HandCoins, ArrowRight } from 'lucide-react';

const ProcessSteps = () => {
    const steps = [
        {
            id: 1,
            title: 'Submit Your Evidence',
            description: 'Upload screenshots, transaction IDs, and chat logs. Our AI legal tool instantly analyzes your case for eligibility.',
            icon: FileText,
            color: 'bg-navy-700',
        },
        {
            id: 2,
            title: 'We File Legal Action',
            description: 'Our specialized lawyers file court orders to freeze the assets of the scammer or force the bank to reverse the charge.',
            icon: Gavel,
            color: 'bg-gold-500',
        },
        {
            id: 3,
            title: 'Funds Recovered',
            description: 'Once the court order is granted, the money is legally seized and returned to your account (minus our success fee).',
            icon: HandCoins,
            color: 'bg-navy-700',
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <span className="text-gold-500 font-bold tracking-wider uppercase text-sm">How It Works</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mt-2 font-playfair">
                        The Legal Recovery Process
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                        We don't just "ask" for your money back. We use the full force of the law to demand it.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connector Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0"></div>

                    {steps.map((step, index) => (
                        <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
                            <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center shadow-xl mb-8 transform transition-transform group-hover:scale-110 border-4 border-white`}>
                                <step.icon className={`w-10 h-10 ${step.color === 'bg-gold-500' ? 'text-navy-900' : 'text-gold-500'}`} />
                            </div>

                            <div className="bg-navy-50 w-8 h-8 rounded-full flex items-center justify-center font-bold text-navy-800 mb-6 border border-navy-100">
                                {step.id}
                            </div>

                            <h3 className="text-xl font-bold text-navy-900 mb-3">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed px-4">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <a href="/start-claim" className="inline-flex items-center gap-2 bg-navy-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gold-500 hover:text-navy-900 transition-all shadow-lg hover:shadow-xl">
                        Check Your Case Eligibility <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ProcessSteps;
