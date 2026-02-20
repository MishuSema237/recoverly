'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Landmark, ArrowRight } from 'lucide-react';

const ServiceSplit = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-navy-900 font-playfair mb-6">
                        Two Powerful Services, <span className="text-gold-600">One Secure Platform</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Whether you need to recover lost funds or protect your current wealth, Recoverly provides the legal and financial infrastructure you need.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Side A: Asset Recovery */}
                    <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-400 to-gold-600"></div>
                        <div className="p-10 lg:p-14">
                            <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform">
                                <Shield className="w-8 h-8 text-navy-700" />
                            </div>
                            <h3 className="text-3xl font-bold text-navy-900 mb-4 font-playfair">Asset Recovery</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                We act as your authorized legal representative to force banks, crypto exchanges, and merchants to reverse unauthorized transactions.
                            </p>

                            <ul className="space-y-4 mb-10 text-gray-600">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                                    <span>Authorized Legal Intervention</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                                    <span>Crypto & Bank Fraud Experts</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                                    <span>No Win, No Fee Structure*</span>
                                </li>
                            </ul>

                            <Link href="/services/asset-recovery" className="inline-flex items-center gap-2 text-navy-700 font-bold hover:text-gold-600 hover:gap-3 transition-all">
                                Start a New Case <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        {/* Background Icon */}
                        <Shield className="absolute -bottom-10 -right-10 w-64 h-64 text-gray-50 opacity-50 transform rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                    </div>

                    {/* Side B: Banking Services */}
                    <div className="group relative bg-navy-900 rounded-3xl shadow-xl overflow-hidden border border-navy-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-navy-400 to-navy-600"></div>
                        <div className="p-10 lg:p-14 text-white">
                            <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mb-8 -rotate-3 group-hover:-rotate-6 transition-transform">
                                <Landmark className="w-8 h-8 text-gold-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4 font-playfair">Banking Services</h3>
                            <p className="text-gray-300 mb-8 leading-relaxed">
                                A fortress for your wealth. Open a secure account with a chartered bank that actively monitors and prevents fraud before it happens.
                            </p>

                            <ul className="space-y-4 mb-10 text-gray-300">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-navy-400"></div>
                                    <span>FDIC Insured Deposits</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-navy-400"></div>
                                    <span>24/7 Fraud Monitoring</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-navy-400"></div>
                                    <span>High-Yield Savings Accounts</span>
                                </li>
                            </ul>

                            <Link href="/services/banking" className="inline-flex items-center gap-2 text-white font-bold hover:text-gold-400 hover:gap-3 transition-all">
                                Open an Account <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        {/* Background Icon */}
                        <Landmark className="absolute -bottom-10 -right-10 w-64 h-64 text-navy-800 opacity-50 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceSplit;
