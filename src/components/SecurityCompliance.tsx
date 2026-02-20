import { Shield, Lock, CheckCircle } from 'lucide-react';

export default function SecurityCompliance() {
    return (
        <section className="py-16 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    <div className="md:w-1/3 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-navy-900 mb-4">Security & Compliance</h2>
                        <p className="text-gray-600">
                            Operating at the highest standards of international banking and legal security to ensure your data and recovered assets are protected.
                        </p>
                    </div>

                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900">GDPR Compliant</h4>
                                <p className="text-xs text-gray-500">Strict EU data protection</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <Lock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900">AES-256 Crypto</h4>
                                <p className="text-xs text-gray-500">Bank-grade data transit</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                            <div className="w-12 h-12 bg-gold-50 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-gold-200">
                                <CheckCircle className="w-6 h-6 text-gold-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-navy-900">Regulated Partners</h4>
                                <p className="text-xs text-gray-500">Tier-1 financial ties</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
