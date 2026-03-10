'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Mail,
    Hash,
    Activity,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileSearch,
    ShieldCheck,
    Zap,
    ChevronRight,
    Scale,
    Building2,
    Shield,
    RefreshCw
} from 'lucide-react';
import { showError } from '@/utils/toast';

const TrackClaimPage = () => {
    const [email, setEmail] = useState('');
    const [claimNumber, setClaimNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [caseData, setCaseData] = useState<any>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !claimNumber) {
            showError('Please enter both email and claim number.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/public-recovery/track?email=${encodeURIComponent(email)}&claimNumber=${encodeURIComponent(claimNumber)}`);
            const data = await response.json();

            if (data.success) {
                setCaseData(data.data);
            } else {
                showError(data.error || 'Case not found.');
            }
        } catch (err) {
            showError('Failed to retrieve case intelligence.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'approved': return 'text-navy-900 bg-gold-500 border-gold-600/20';
            case 'investigating': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'forensic_phase': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            case 'funds_frozen': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
            case 'legal_action': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
            default: return 'text-gold-500 bg-gold-500/10 border-gold-500/20';
        }
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500';
            case 'rejected': return 'bg-red-500';
            case 'approved': return 'bg-gold-500';
            case 'investigating': return 'bg-blue-500';
            case 'forensic_phase': return 'bg-purple-500';
            case 'funds_frozen': return 'bg-cyan-500';
            case 'legal_action': return 'bg-indigo-500';
            default: return 'bg-gold-500';
        }
    };

    const getStatusSteps = (status: string) => {
        const steps = [
            { title: 'Intelligence Audit', icon: <FileSearch />, status: 'pending', desc: 'Case initialized and awaiting officer assignment.' },
            { title: 'Forensic Trace', icon: <Search />, status: 'pending', desc: 'Analyzing blockchain ledgers and international Swift records.' },
            { title: 'Legal Demand', icon: <Scale />, status: 'pending', desc: 'Issuing formal demands to receiving institutions and PSPs.' },
            { title: 'Bank Freeze', icon: <Building2 />, status: 'pending', desc: 'Securing temporary freezing orders on illicit accounts.' },
            { title: 'Asset Release', icon: <Shield />, status: 'pending', desc: 'Authorized for repatriation to original banking vault.' },
            { title: 'Transmission', icon: <RefreshCw />, status: 'pending', desc: 'Finalized settlement of assets into your secure wallet.' }
        ];

        const statusOrder = ['pending', 'investigating', 'forensic_phase', 'legal_action', 'funds_frozen', 'approved', 'completed'];
        const currentIndex = statusOrder.indexOf(status);

        if (currentIndex === -1) return steps;

        let activeStepIndex = 0;
        if (status === 'forensic_phase') activeStepIndex = 1;
        else if (status === 'legal_action') activeStepIndex = 2;
        else if (status === 'funds_frozen') activeStepIndex = 3;
        else if (status === 'approved') activeStepIndex = 4;
        else if (status === 'completed') activeStepIndex = 5;

        steps.forEach((step, idx) => {
            if (idx < activeStepIndex) step.status = 'completed';
            else if (idx === activeStepIndex) step.status = 'active';
            else step.status = 'pending';
        });

        if (status === 'completed') {
            steps.forEach(s => s.status = 'completed');
        }

        return steps;
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/5 text-navy-900 text-[10px] font-black uppercase tracking-widest"
                        >
                            <Activity className="w-4 h-4 text-gold-600" />
                            Live Case Intelligence
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl mobile:text-6xl font-black text-navy-900 tracking-tighter"
                        >
                            TRACK YOUR <span className="text-gold-600">CLAIM</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 font-medium max-w-xl mx-auto"
                        >
                            Enter your forensic reference details to view the real-time status and timeline of your asset repatriation protocol.
                        </motion.p>
                    </div>

                    {!caseData ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[40px] p-8 mobile:p-12 shadow-2xl shadow-navy-900/5 border border-gray-100 max-w-2xl mx-auto"
                        >
                            <form onSubmit={handleTrack} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Registered Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="e.g. john@example.com"
                                            className="w-full px-6 py-5 pl-14 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gold-500/20 text-navy-950 font-medium placeholder:text-gray-300"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Claim Number (Forensic ID)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="e.g. REC-XXXX-XXXX"
                                            className="w-full px-6 py-5 pl-14 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-gold-500/20 text-navy-950 font-black tracking-widest uppercase placeholder:text-gray-300 transition-all focus:bg-white"
                                            value={claimNumber}
                                            onChange={(e) => setClaimNumber(e.target.value)}
                                        />
                                        <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full py-5 bg-navy-900 text-gold-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : <Search className="w-5 h-5" />}
                                    Locate Case Intelligence
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Forgot your claim number?</p>
                                <button className="text-gold-600 font-black text-xs uppercase tracking-widest mt-2 hover:underline">Contact Intelligence Support</button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            {/* Summary Card */}
                            <div className="bg-navy-900 rounded-[40px] p-8 mobile:p-12 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gold-500">Forensic Briefing</span>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(caseData.status)}`}>
                                                {caseData.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl mobile:text-4xl font-black tracking-tight uppercase">{caseData.claimNumber}</h2>
                                        <p className="text-white/40 text-sm font-medium mt-1">{caseData.scamType}</p>
                                    </div>

                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Impact Evaluation</p>
                                        <p className="text-3xl font-black text-white">$ {caseData.amountLost.toLocaleString()}</p>
                                        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-widest mt-1">Authorized for Repatriation</p>
                                    </div>
                                </div>

                                {caseData.status === 'completed' && (
                                    <div className="mt-12 p-6 rounded-3xl bg-gold-500 text-navy-950 flex flex-col md:flex-row items-center justify-between gap-6 anime-in bounce-in">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black uppercase tracking-tight">Funds Ready for Payout</h4>
                                                <p className="text-xs font-bold opacity-70">Complete account activation to receive your net assets.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => window.location.href = '/signup'} className="w-full md:w-auto px-8 py-3 bg-navy-900 text-gold-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-navy-800 transition-all">
                                            Finalize Withdrawal
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Steps Visualizer */}
                            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mobile:gap-4">
                                {getStatusSteps(caseData.status).map((step, idx) => (
                                    <div key={idx} className={`p-6 rounded-[2rem] border transition-all ${step.status === 'active'
                                        ? 'bg-white border-gold-500 shadow-xl shadow-gold-500/5'
                                        : step.status === 'completed'
                                            ? 'bg-emerald-50 border-emerald-100'
                                            : 'bg-white border-gray-100 opacity-60'
                                        }`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${step.status === 'active' ? 'bg-navy-900 text-gold-500' :
                                            step.status === 'completed' ? 'bg-emerald-500 text-white' :
                                                'bg-gray-100 text-gray-400'
                                            }`}>
                                            {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                                        </div>
                                        <h4 className="font-black text-navy-900 text-[10px] uppercase tracking-tighter mb-1.5">{step.title}</h4>
                                        <p className="text-[8px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest">{step.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-[40px] p-8 mobile:p-12 shadow-2xl shadow-navy-900/5 border border-gray-100">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-navy-900 uppercase tracking-tight">Case Timeline</h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Full chronological history of forensic actions.</p>
                                    </div>
                                </div>

                                <div className="space-y-12 relative">
                                    <div className="absolute top-0 left-6 h-full w-0.5 bg-gray-50 lg:left-8"></div>

                                    {(caseData.updates || []).length > 0 ? (
                                        caseData.updates.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((update: any, i: number) => (
                                            <div key={i} className="relative pl-16 lg:pl-24 group">
                                                <div className={`absolute left-4 lg:left-6 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white transition-all duration-500 z-10 
                                                    ${caseData.status === 'completed' ? 'bg-emerald-500' :
                                                        i === 0 ? `${getStatusDotColor(update.status)} scale-125 shadow-lg` : 'bg-gray-200 group-hover:bg-gold-500/50'}
                                                    `}></div>

                                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                                    <div className="space-y-1 max-w-xl">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${getStatusColor(update.status)}`}>
                                                            {update.status.replace('_', ' ')}
                                                        </span>
                                                        <p className="text-navy-900 font-bold text-sm tracking-tight">{update.message}</p>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-1 shrink-0">
                                                        {new Date(update.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center text-gray-300">
                                            <FileSearch className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                            <p className="text-xs font-black uppercase tracking-widest">Case initialized. Awaiting officer assignment.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reset Control */}
                            <div className="text-center">
                                <button
                                    onClick={() => setCaseData(null)}
                                    className="px-8 py-3 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-navy-900 hover:border-navy-900 transition-all"
                                >
                                    Clear Intelligence Feed
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackClaimPage;
