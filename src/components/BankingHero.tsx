'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Landmark, ArrowRight, Zap, Globe, Lock } from 'lucide-react';

const BankingHero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-[#0a0f1a]">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[120px] -mr-64 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Content */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-black uppercase tracking-widest mb-8"
                        >
                            <Landmark className="w-4 h-4" />
                            Institiutional Grade Private Banking
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl mobile:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8"
                        >
                            Secure Your <span className="text-gold-500 italic">Wealth</span>. <br />
                            Master Your <span className="underline decoration-gold-500/30 underline-offset-8">Future</span>.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg mobile:text-xl text-white/60 font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Experience a new standard in asset management. Recoverly combines Swiss-level security with cutting-edge technology to protect and grow your capital globally.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col mobile:flex-row items-center justify-center lg:justify-start gap-5"
                        >
                            <Link href="/signup" className="group relative w-full mobile:w-auto px-10 py-5 bg-gold-500 text-navy-950 rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(191,155,48,0.4)] active:scale-95">
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Open Private Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </Link>
                            <Link href="/login" className="w-full mobile:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all text-center">
                                Secure Client Portal
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="mt-16 pt-10 border-t border-white/5 flex flex-wrap justify-center lg:justify-start gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
                        >
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-gold-500" />
                                <span className="text-sm font-black text-white uppercase tracking-tighter">PCI-DSS Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-gold-500" />
                                <span className="text-sm font-black text-white uppercase tracking-tighter">256-bit AES Encryption</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-gold-500" />
                                <span className="text-sm font-black text-white uppercase tracking-tighter">Global Liquidity</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Visual */}
                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-10"
                        >
                            <div className="relative z-20 bg-[#111827] border border-white/10 rounded-3xl p-6 mobile:p-10 shadow-2xl shadow-black/50 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gold-500/50"></div>

                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Wealth Overview</p>
                                        <h3 className="text-3xl mobile:text-4xl font-black text-white tracking-tighter">$1,482,900.00</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'Private Equity', val: '$840,000.00', pct: 65, color: 'bg-gold-500' },
                                        { label: 'Liquid Assets', val: '$412,000.00', pct: 28, color: 'bg-blue-500' },
                                        { label: 'Real Estate REITS', val: '$230,900.00', pct: 45, color: 'bg-emerald-500' }
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-gray-400">{item.label}</span>
                                                <span className="text-white">{item.val}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.pct}%` }}
                                                    transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                                                    className={`h-full ${item.color}`}
                                                ></motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Market Status: Bullish</span>
                                    </div>
                                    <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest text-right">Updated 2m ago</span>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
                        </motion.div>

                        {/* Floating Card */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="absolute -right-8 bottom-20 z-30 hidden mobile:block bg-gold-600 p-6 rounded-2xl shadow-xl shadow-gold-600/20 max-w-[200px]"
                        >
                            <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Alpha Yield Protocol</h4>
                            <p className="text-2xl font-black text-white mb-1">+24.8%</p>
                            <p className="text-[8px] text-white/70 font-bold uppercase tracking-widest">Annualized Performance</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BankingHero;
