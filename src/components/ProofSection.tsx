'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Scale, FileText, ShieldCheck } from 'lucide-react';

const ProofSection = () => {
    const [recoveredAmount, setRecoveredAmount] = useState(14230500);

    // Simulate live ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setRecoveredAmount(prev => prev + Math.floor(Math.random() * 100));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const documents = [
        { title: 'Court Order #2938', type: 'Asset Freeze', status: 'Granted', date: 'Oct 12, 2025' },
        { title: 'Bank Settlement', type: 'Refund Issued', status: 'Success', date: 'Oct 14, 2025' },
        { title: 'Legal Notice', type: 'Demand Letter', status: 'Delivered', date: 'Oct 15, 2025' },
    ];

    return (
        <section className="py-24 bg-navy-900 text-white overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-800/30 skew-x-12 transform origin-top-right"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Stats & Text */}
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold font-playfair leading-tight">
                            Real Results.<br />
                            <span className="text-gold-500">Real Recovery.</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-lg">
                            We have successfully recovered millions for victims of investment fraud, crypto scams, and unauthorized banking transactions.
                        </p>

                        <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700 shadow-2xl">
                            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-2">Total Funds Recovered</p>
                            <div className="text-4xl md:text-6xl font-bold text-white font-mono tracking-tighter">
                                {formatCurrency(recoveredAmount)}
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-gold-500 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Live Ticker - Updated Real-time
                            </div>
                        </div>

                        <div className="flex gap-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">94%</span>
                                <span className="text-sm text-gray-400">Success Rate</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">12k+</span>
                                <span className="text-sm text-gray-400">Cases Won</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">Global</span>
                                <span className="text-sm text-gray-400">Jurisdiction</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Document Gallery */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-3xl"></div>

                        <div className="space-y-6">
                            {documents.map((doc, index) => (
                                <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex items-center gap-6 hover:bg-white/10 transition-all cursor-default">
                                    <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Scale className="w-6 h-6 text-gold-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-white">{doc.title}</h4>
                                            <span className="text-xs text-gray-400">{doc.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm text-gray-300">{doc.type}</span>
                                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> {doc.status}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Blurred preview effect */}
                                    <div className="w-16 h-8 bg-gray-600/50 rounded blur-sm"></div>
                                </div>
                            ))}

                            <div className="bg-navy-800/50 border border-gold-500/30 rounded-xl p-6 text-center">
                                <ShieldCheck className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                                <p className="text-sm text-gray-300">
                                    <span className="font-bold text-white">Verified Authority</span><br />
                                    We are authorized to interface directly with banking fraud departments.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProofSection;
