import { ArrowRight } from 'lucide-react';

const cases = [
    {
        type: 'Forensic Bank Levy',
        scam: 'Unregulated Forex Broker',
        amount: '$1.2M',
        timeframe: '45 Days',
        location: 'Cyprus',
        description: 'Successfully froze and repatriated funds from a fraudulent overseas trading platform masquerading as a licensed broker.'
    },
    {
        type: 'Blockchain Tracing',
        scam: 'Crypto Liquidity Pool Scam',
        amount: '24.5 BTC',
        timeframe: '60 Days',
        location: 'Dubai',
        description: 'Collaborated with international authorities to track illicit token movements and force settlement via wallet blacklisting.'
    },
    {
        type: 'Wire Recall & Legal Demand',
        scam: 'Romance Investment Fraud',
        amount: '$450,000',
        timeframe: '30 Days',
        location: 'Singapore',
        description: 'Intercepted SWIFT transfers early and issued immediate legal demands to the receiving international banking institution.'
    }
];

export default function RecentCases() {
    return (
        <section className="py-24 bg-navy-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, #C9933A 0%, transparent 50%)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-sm font-bold tracking-widest text-gold-400 uppercase mb-3">Proven Results</h2>
                        <h3 className="text-4xl font-bold mb-6">Recent Success Cases</h3>
                        <p className="text-gray-300 text-lg">
                            Our legal and forensic team routinely handles complex international financial fraud. Here are some of our recently closed cases.
                        </p>
                    </div>
                    <button className="hidden text-gold-400 hover:text-gold-300 font-semibold items-center gap-2 group transition-colors">
                        View All Cases
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cases.map((c, idx) => (
                        <div key={idx} className="bg-navy-800 border border-navy-700/50 p-8 rounded-xl hover:bg-navy-800/80 transition-colors">
                            <div className="inline-block px-3 py-1 bg-gold-400/10 text-gold-400 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                                {c.type}
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">{c.scam}</h4>
                            <p className="text-gray-400 text-sm mb-6">Jurisdiction: {c.location}</p>

                            <div className="flex gap-4 mb-6 pb-6 border-b border-navy-700">
                                <div>
                                    <div className="text-3xl font-bold text-gold-400">{c.amount}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Recovered</div>
                                </div>
                                <div className="w-px bg-navy-700" />
                                <div>
                                    <div className="text-3xl font-bold text-white">{c.timeframe}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Time to Resolution</div>
                                </div>
                            </div>

                            <p className="text-gray-300 leading-relaxed font-light">
                                {c.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
