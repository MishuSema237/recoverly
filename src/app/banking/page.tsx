import type { Metadata } from 'next';
import { Shield, Globe, Briefcase, ArrowRight, Building2, Smartphone, Lock, CheckCircle2 } from 'lucide-react';
import PublicRoute from '@/components/PublicRoute';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Private Digital Banking | Recoverly Trust Bank',
    description: 'A modern, digital-only bank designed to support sustainable growth, commercial property investment, and secure asset recovery.',
};

const features = [
    {
        icon: Smartphone,
        title: 'Digital-Only Private Banking',
        description: 'Experience prestige banking that makes access to savings and international settlements fast, simple, and entirely mobile-first.',
    },
    {
        icon: Building2,
        title: 'Commercial Property & Investment',
        description: 'Align your assets with global trends. We offer specialized lending and bridging finance for US and international commercial properties.',
    },
    {
        icon: Shield,
        title: 'Recoverly Safe Vault',
        description: 'For victims of cyber scams, our fully insured depository accounts temporarily hold and secure your recovered assets before final disbursement.',
    },
    {
        icon: Globe,
        title: 'Multi-Currency Accounts',
        description: 'Trade FX and hold balances in over 15 currencies. Bypass intermediary delays with direct institutional SWIFT and SEPA transfers.',
    },
    {
        icon: Briefcase,
        title: 'Wealth Management',
        description: 'Exclusive services for high-net-worth individuals, providing personalized liquidity solutions, mutual funds, and pension schemes.',
    },
    {
        icon: Lock,
        title: 'Bank-Grade Cyber Security',
        description: 'AES-256 encryption, mandatory 2FA, and behavioral biometrics protect your wealth from unauthorized access 24/7.',
    }
];

export default function BankingServicesPage() {
    return (
        <PublicRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <section className="bg-navy-900 text-white pt-32 pb-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/0b1626/1e293b?text=Modern+Bank+Architecture')] opacity-20 bg-cover bg-center mix-blend-overlay" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-gold-500 font-bold tracking-widest uppercase mb-4 text-sm">Welcome to Recoverly Finance</h2>
                                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">A Modern, Digital-Only Private Bank.</h1>
                                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                    Designed to support sustainable growth in commercial property, secure wealth management, and expert recovery of funds lost to cyber scams.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/signup"
                                        className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-4 rounded-lg transition-transform hover:-translate-y-1 shadow-lg"
                                    >
                                        Open An Account
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/20 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                                    >
                                        Contact Private Advisor
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden lg:block relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <img src="https://placehold.co/800x1200/1e293b/c9933a?text=Mobile+Banking+App+Interface" alt="Recoverly Digital Banking App" className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-900 to-transparent p-8">
                                    <div className="flex items-center gap-3 text-white mb-2">
                                        <Shield className="w-6 h-6 text-gold-500" />
                                        <span className="font-bold">Banking for the digital age.</span>
                                    </div>
                                    <p className="text-sm text-gray-300">Manage your portfolio, track recoveries, and trade FX from anywhere.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold tracking-widest text-gold-500 uppercase mb-3">Institutional Grade</h2>
                            <h3 className="text-4xl font-bold text-navy-900">Elite Banking Services</h3>
                            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                                Whether you are investing in commercial real estate or securing assets recovered from fraud, we provide the infrastructure.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-gray-50 p-10 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold-500/30 transition-all group">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-8 h-8 text-gold-500" />
                                    </div>
                                    <h4 className="text-xl font-bold text-navy-900 mb-4">{feature.title}</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Account Types */}
                <section className="py-24 bg-gray-50 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold tracking-widest text-gold-500 uppercase mb-3">Customized Financial Solutions</h2>
                            <h3 className="text-4xl font-bold text-navy-900">Tailored Account Types</h3>
                            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                                From everyday checking to specialized investment and corporate structures, we have the perfect account to meet your needs.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: 'Checking Account', desc: 'Secure and flexible account for your everyday business and lifestyle transactions.' },
                                { name: 'Savings Account', desc: 'Accelerate your wealth with competitive interest rates on your secure deposits.' },
                                { name: 'Fixed Deposit', desc: 'Lock in industry-leading rates for guaranteed returns over fixed terms.' },
                                { name: 'Crypto Currency', desc: 'Seamlessly hold, trade, and manage your digital assets alongside fiat.' },
                                { name: 'Business Account', desc: 'Tailored solutions designed for rapid scaling of small to medium enterprises.' },
                                { name: 'Corporate Account', desc: 'Institutional banking for large-scale operations and complex corporate structures.' },
                                { name: 'Non-Resident', desc: 'Frictionless international banking and offshore security for global citizens.' },
                                { name: 'Investment Account', desc: 'Direct access to global equities, mutual funds, and commercial property portfolios.' }
                            ].map((acc, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gold-300 transition-all">
                                    <h4 className="font-bold text-navy-900 mb-2">{acc.name}</h4>
                                    <p className="text-sm text-gray-600">{acc.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Fusion Section: Banking + Recovery */}
                <section className="py-24 bg-navy-900 text-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                                <img src="https://placehold.co/800x1000/1e293b/c9933a?text=Financial+Fraud+Investigation" alt="Financial Fraud Investigation" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold tracking-widest text-gold-500 uppercase mb-3">The Recoverly Advantage</h2>
                                <h3 className="text-4xl font-bold mb-6">Banking Meets Cyber Recovery.</h3>
                                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                    Unlike traditional banks that turn away fraud victims, Recoverly was built to solve this exact problem. We operate specialized legal departments internally to pursue lost funds.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {[
                                        'Forensic tracing of cryptocurrency and wire transfers',
                                        'Issuing legal demands directly to offshore institutions',
                                        'Securing recovered funds in your Safe Vault account',
                                        'No upfront legal fees—we win when you win'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0" />
                                            <span className="text-gray-200">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/asset-recovery"
                                    className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-bold text-lg"
                                >
                                    Learn about our Asset Recovery Process
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Account Opening Steps */}
                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-navy-900 mb-12">Open a Super Savings Account in 5 Minutes</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-200 z-0" />

                            {[
                                { step: '1', title: 'Submit Documents', desc: 'Upload your ID and proof of address securely via our portal.' },
                                { step: '2', title: 'KYC Verification', desc: 'Our compliance team verifies your identity within minutes.' },
                                { step: '3', title: 'Deposit & Grow', desc: 'Fund your account and access our suite of private banking tools.' }
                            ].map((item, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-white rounded-full border-4 border-navy-50 flex items-center justify-center mb-6 shadow-sm">
                                        <span className="text-3xl font-bold text-gold-500">{item.step}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-navy-900 mb-2">{item.title}</h4>
                                    <p className="text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 bg-gray-50 border-t border-gray-200 text-center">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-navy-900 mb-6">Protect Your Capital Today</h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Whether you are recovering from a scam or seeking a fortress for your wealth, our private banking advisors are ready.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-lg transition-transform hover:-translate-y-1 shadow-md"
                        >
                            Open a Secure Account
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

            </div>
        </PublicRoute>
    );
}
