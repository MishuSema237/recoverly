import type { Metadata } from 'next';
import { Shield, Bitcoin, HeartHandshake, TrendingDown, FileSearch, Scale, Building2, CheckCircle2, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import PublicRoute from '@/components/PublicRoute';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Emergency Service Request | Recoverly Trust Bank',
    description: 'Specialized forensic analysis and legal recovery for victims of crypto, forex, and romance scams. Get your cashback.',
};

const scamTypes = [
    {
        icon: Bitcoin,
        title: 'Crypto Wealth Recovery',
        description: 'We utilize advanced blockchain forensics to trace stolen Bitcoin and stablecoins. Even when moved through mixers, our tools identify the final off-ramp exchange to issue legal freezing orders.',
    },
    {
        icon: TrendingDown,
        title: 'Forex & Investment Fraud',
        description: 'Unregulated brokers use manipulation tactics. We target the Payment Service Providers (PSPs) and acquiring banks that facilitated the illegal transactions to secure your refund.',
    },
    {
        icon: HeartHandshake,
        title: 'Romance & Social Engineering',
        description: 'These scams combine emotional manipulation with financial ruin. We handle these cases with discretion, focusing on recovering funds sent via wire transfers to overseas syndicate accounts.',
    },
    {
        icon: Shield,
        title: 'Phishing & Bank Hacks',
        description: 'If your account was compromised due to security negligence from an institution, we hold them accountable for regulatory failures and demand immediate financial restitution.',
    },
];

const processSteps = [
    {
        icon: FileSearch,
        title: 'Phase 1: Forensic Trace',
        description: 'Our certified forensic accountants analyze the digital trails. We map out exactly where your funds were sent, parsing blockchain ledgers and international Swift wire records.'
    },
    {
        icon: Scale,
        title: 'Phase 2: Legal Demand',
        description: 'Leveraging our network, we issue formal legal demands to the receiving institutions (banks, exchanges) invoking compliance and anti-money laundering (AML) violations.'
    },
    {
        icon: Building2,
        title: 'Phase 3: Bank Freeze',
        description: 'We secure temporary freezing orders on the illicit accounts to prevent further dissipation of assets while the formal recovery claim is processed.'
    },
    {
        icon: RefreshCw,
        title: 'Phase 4: Fast Cashback',
        description: 'Once liability is established, the recovered cashback is legally repatriated directly to your Recoverly Safe Vault or original banking institution.'
    }
];

export default function AssetRecoveryPage() {
    return (
        <PublicRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Emergency Action Hero */}
                <section className="bg-navy-900 text-white pt-32 pb-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/0b1626/1e293b?text=Cyber+Security+Operations')] opacity-20 bg-cover bg-center mix-blend-overlay" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-[#c9933a]/20 text-red-400 font-bold px-4 py-2 rounded-full mb-6 border border-[#c9933a]/30">
                                    <Zap className="w-4 h-4" />
                                    <span>Emergency Service Request</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">We Follow The Money. You Get Your Cashback.</h1>
                                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                    Cyber fraud is complex, but the financial system leaves a trace. We combine intelligence-grade digital forensics with aggressive litigation to secure swift refunds for victims of financial scams.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/signup"
                                        className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-4 rounded-lg transition-transform hover:-translate-y-1 shadow-lg"
                                    >
                                        Report a Scam Now
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold px-8 py-4 rounded-lg transition-colors border border-navy-700"
                                    >
                                        Call Emergency Desk
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden lg:block relative">
                                <div className="absolute inset-0 bg-gold-500/20 blur-3xl rounded-full" />
                                <img src="https://placehold.co/800x800/1e293b/c9933a?text=Blockchain+Tracing+Dashboard" alt="Forensic Analysis Dashboard" className="relative z-10 w-full h-auto rounded-2xl shadow-2xl border border-white/10" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Refund Types */}
                <section className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold tracking-widest text-gold-500 uppercase mb-3">Our Expertise</h2>
                            <h3 className="text-4xl font-bold text-navy-900">Eligible Cashback Categories</h3>
                            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                                If you have lost funds in any of these categories within the last 24 months, you may be eligible for a full refund through our legal intervention.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {scamTypes.map((scam, index) => (
                                <div key={index} className="bg-gray-50 p-10 rounded-xl border border-gray-100 flex flex-col hover:shadow-xl hover:border-gold-500/30 transition-all group">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:bg-gold-500 transition-colors">
                                            <scam.icon className="w-8 h-8 text-navy-900 group-hover:text-white transition-colors" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-navy-900">{scam.title}</h4>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-lg flex-1">
                                        {scam.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Action Blueprint (Image + Text) */}
                <section className="py-24 bg-navy-900 text-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-sm font-bold tracking-widest text-gold-500 uppercase mb-3">The Recovery Blueprint</h2>
                                <h3 className="text-4xl font-bold mb-6">Swift Bank Intervention.</h3>
                                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                    Our success rate stems from bypassing slow local police departments. We go directly to the global financial hubs processing the illicit transactions and hold them accountable for KYC (Know Your Customer) failures.
                                </p>
                                <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 mt-8 mb-8">
                                    <h4 className="text-gold-500 font-bold mb-2 flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        No Win, No Fee Guarantee
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        We cover all upfront forensic and legal costs. Our fee is a strict percentage taken only after the successful restitution of your cashback into your account.
                                    </p>
                                </div>
                            </div>
                            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
                                <img src="https://placehold.co/800x1200/1e293b/c9933a?text=Legal+Action+Briefs" alt="Legal Action and Bank Demands" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 text-center bg-navy-900/90 backdrop-blur-md p-6 rounded-xl border border-white/10">
                                    <p className="font-bold text-gold-500 text-xl mb-1">$1.2B+</p>
                                    <p className="text-sm text-gray-300 uppercase tracking-wider">Total Illicit Funds Traced</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4-Step Legal Process */}
                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold tracking-widest text-gold-500 uppercase mb-3">Process</h2>
                            <h3 className="text-4xl font-bold text-navy-900">How You Get Your Money Back</h3>
                        </div>

                        <div className="relative">
                            {/* Connecting Line */}
                            <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-1 bg-gray-100 rounded-full" />

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                                {processSteps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center text-center group">
                                        <div className="w-16 h-16 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:border-gold-500 group-hover:bg-gold-50 transition-colors shadow-sm relative relative bg-white z-10">
                                            <span className="text-xl font-bold text-navy-900">{index + 1}</span>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 group-hover:shadow-md transition-shadow w-full h-full">
                                            <div className="flex justify-center mb-4">
                                                <step.icon className="w-8 h-8 text-gold-500" />
                                            </div>
                                            <h4 className="text-xl font-bold text-navy-900 mb-3">{step.title}</h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 bg-gray-50 border-t border-gray-200 text-center">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-navy-900 mb-6">Time is Critical</h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Scammers move stolen assets rapidly across jurisdictions. The faster we launch our forensic trace, the higher the probability of your cashback.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 bg-[#c9933a] hover:bg-[#b08132] text-white font-bold px-8 py-4 rounded-lg transition-transform hover:-translate-y-1 shadow-md"
                        >
                            <Zap className="w-5 h-5" />
                            Launch Emergency Trace
                        </Link>
                    </div>
                </section>
            </div>
        </PublicRoute>
    );
}
