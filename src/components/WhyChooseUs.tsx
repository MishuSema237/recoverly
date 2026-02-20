import { ShieldCheck, Globe, Scale, Clock } from 'lucide-react';

const reasons = [
    {
        icon: ShieldCheck,
        title: 'Bank-Grade Security',
        description: 'We protect your data with AES-256 encryption and follow strict financial sector compliance protocols.'
    },
    {
        icon: Globe,
        title: 'Global Legal Network',
        description: 'Our partners span across 40+ jurisdictions, allowing us to pursue offshore accounts and international brokers.'
    },
    {
        icon: Scale,
        title: 'Forensic Expertise',
        description: 'Our team consists of ex-prosecutors and forensic accountants who understand the complex movement of illicit funds.'
    },
    {
        icon: Clock,
        title: '24/7 Case Tracking',
        description: 'Clients receive access to a secure portal for real-time updates on their asset recovery process and legal filings.'
    }
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold tracking-widest text-gold-500 uppercase mb-3">The Recoverly Advantage</h2>
                    <h3 className="text-4xl font-bold text-navy-900 mb-6">Why Choose Us</h3>
                    <p className="text-gray-600 text-lg">
                        We bridge the gap between law enforcement and banking to recover what is rightfully yours. Our specialized approach yields industry-leading retrieval rates.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reasons.map((reason, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-navy-900/5 rounded-lg flex items-center justify-center mb-6">
                                <reason.icon className="w-8 h-8 text-gold-500" />
                            </div>
                            <h4 className="text-xl font-bold text-navy-900 mb-4">{reason.title}</h4>
                            <p className="text-gray-600 leading-relaxed">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
