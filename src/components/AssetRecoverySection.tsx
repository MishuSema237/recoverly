'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, FileSearch, ArrowRight, ShieldCheck, Activity, Users } from 'lucide-react';

const AssetRecoverySection = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50/50 -skew-x-12 translate-x-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Visual Side */}
                    <div className="lg:w-1/2 order-2 lg:order-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Separate Cards for Desktop & Tablet */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="hidden md:flex flex-col bg-navy-900 p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-navy-900/10"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tight">94% Recovery Rate</h4>
                                <p className="text-xs text-white/60 font-medium">Successfully repatriated over $2.4B in assets across 12,000+ forensic cases globally.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="hidden md:flex flex-col bg-gold-500 p-8 rounded-3xl text-navy-900 space-y-4 shadow-xl shadow-gold-500/10 text-right items-end md:text-left md:items-start"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tight">Real-time Intel</h4>
                                <p className="text-xs text-black/60 font-black uppercase tracking-widest leading-tight">Live tracking of blockchain movements and cold-wallet forensic updates.</p>
                            </motion.div>

                            {/* Merged Card with Diagonal Split for Mobile */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="md:hidden col-span-1 relative rounded-3xl overflow-hidden shadow-2xl min-h-[400px] flex flex-col"
                            >
                                {/* Top Section: Navy-900 */}
                                <div
                                    className="bg-navy-900 p-8 pt-12 pb-24 text-white space-y-4 relative flex-1 flex flex-col justify-center overflow-hidden"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' }}
                                >
                                    {/* Background Icon */}
                                    <ShieldCheck className="absolute -right-4 -top-4 w-56 h-56 text-gold-500/10 rotate-12 pointer-events-none" />

                                    <div className="relative z-10">
                                        <h4 className="text-2xl font-black uppercase tracking-tight mb-2">94% Recovery Rate</h4>
                                        <p className="text-sm text-white/70 font-medium leading-relaxed">Successfully repatriated over $2.4B in assets across 12,000+ forensic cases globally.</p>
                                    </div>
                                </div>

                                {/* Bottom Section: Gold-500 */}
                                <div
                                    className="bg-gold-500 p-8 pt-20 pb-12 text-navy-900 space-y-4 -mt-16 relative z-[-1] flex-1 flex flex-col justify-center items-end text-right overflow-hidden"
                                >
                                    {/* Background Icon */}
                                    <Activity className="absolute -left-6 -bottom-6 w-64 h-64 text-black/5 -rotate-12 pointer-events-none" />

                                    <div className="relative z-10">
                                        <h4 className="text-2xl font-black uppercase tracking-tight mb-2">Real-time Intel</h4>
                                        <p className="text-sm text-black/70 font-black uppercase tracking-widest leading-tight">Live tracking of blockchain movements and cold-wallet forensic updates.</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="col-span-2 bg-gray-50 p-10 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center gap-8"
                            >
                                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center shrink-0">
                                    <Users className="w-10 h-10 text-navy-900" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-navy-900 uppercase tracking-tighter mb-2">Global Task Force</h4>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed">Our elite team consists of former intelligence officers, blockchain developers, and legal experts specializing in international asset laundering and fraud mitigation.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-1/2 order-1 lg:order-2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/5 text-navy-900 text-[10px] font-black uppercase tracking-widest mb-6"
                        >
                            <ShieldAlert className="w-4 h-4 text-burgundy-600" />
                            Asset Repatriation & Fraud Mitigation
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl mobile:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight leading-[1.1] mb-8"
                        >
                            Lost Assets? <br />
                            Secure Your <span className="text-gold-600 italic underline decoration-gold-500/20 underline-offset-8">Repatriation</span>.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-500 font-medium mb-10 max-w-xl mx-auto lg:mx-0"
                        >
                            If you have been a victim of financial fraud, crypto scams, or unauthorized fund transfers, our forensic intelligence division is ready to assist in the recovery process.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col mobile:flex-row items-center justify-center lg:justify-start gap-5"
                        >
                            <Link href="/asset-recovery/report" className="w-full mobile:w-auto px-10 py-5 bg-navy-900 text-gold-500 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 active:scale-95">
                                <FileSearch className="w-5 h-5" />
                                File Forensic Report
                            </Link>
                            <Link href="/track-claim" className="w-full mobile:w-auto px-10 py-5 bg-white border border-gray-200 text-navy-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all text-center">
                                Track Existing Claim
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-12 flex items-center justify-center lg:justify-start gap-4"
                        >
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <span className="text-navy-900 font-black">200+</span> Officers active today
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AssetRecoverySection;
