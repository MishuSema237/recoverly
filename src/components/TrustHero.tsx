'use client';

import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, Scale, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const TrustHero = () => {
    const [transactionId, setTransactionId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would redirect to the claim flow with this ID
        window.location.href = `/start-claim?tid=${transactionId}`;
    };

    return (
        <div className="relative bg-navy-900 overflow-hidden min-h-[90vh] flex items-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>

            {/* Hero Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20 pb-16 md:pt-0 md:pb-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Text & Hook */}
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center space-x-2 bg-navy-800 rounded-full px-4 py-1.5 border border-gold-500/30">
                            <Shield className="w-4 h-4 text-gold-500" />
                            <span className="text-gold-200 text-sm font-medium tracking-wide">AUTHORIZED ASSET RECOVERY AGENTS</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-playfair text-white leading-tight">
                            Scammed? <br />
                            <span className="text-gold-500">We Fight Back.</span>
                        </h1>

                        <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                            Banks often refuse to help. We don't. Recoverly combines legal force with banking security to recover your lost funds from scams and unauthorized transactions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/services/asset-recovery" className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(201,147,58,0.3)] hover:shadow-[0_0_30px_rgba(201,147,58,0.5)] flex items-center justify-center gap-2">
                                Start Recovery
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/services/banking" className="px-8 py-4 rounded-lg font-bold text-lg text-white border-2 border-navy-600 hover:bg-navy-800 hover:border-gold-500/50 transition-all flex items-center justify-center">
                                Explore Banking
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 pt-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Scale className="w-5 h-5 text-gold-500" />
                                <span>Legally Certified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-gold-500" />
                                <span>Bank-Grade Security</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Quick Action Hero Form */}
                    <div className="relative lg:ml-auto w-full max-w-md">
                        {/* Form Card */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-20 border-[8px] border-navy-800/30">
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12 hidden md:flex">
                                <div className="text-navy-900 font-bold text-center text-xs leading-tight">
                                    <span className="text-xl block mb-1">98%</span>
                                    Success<br />Rate
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-navy-900 mb-2 font-playfair">Start Your Claim</h3>
                            <p className="text-gray-500 mb-6 text-sm">Check if your transaction is eligible for immediate legal recovery.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-navy-700 mb-1">Was this a Scam or Unauthorized Charge?</label>
                                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none transition-all text-gray-700">
                                        <option>Crypto Scam / Investment Fraud</option>
                                        <option>Unauthorized Bank Transfer</option>
                                        <option>Credit Card Chargeback</option>
                                        <option>Romance Scam</option>
                                        <option>Other Fraud</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-navy-700 mb-1">Transaction ID / Reference (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. TXN-123456789"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none transition-all text-navy-900 placeholder-gray-400"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="w-full bg-navy-600 hover:bg-navy-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group">
                                        <span>Verify Eligibility Now</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        Your data is protected by attorney-client privilege.
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Decorative Elements behind form */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full bg-gold-500/20 rounded-2xl z-10"></div>
                        <div className="absolute -bottom-12 -right-12 w-full h-full bg-navy-600/20 rounded-2xl z-0"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TrustHero;
