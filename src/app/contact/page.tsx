import type { Metadata } from 'next';
import { Mail, Phone, MapPin, ShieldAlert, Lock } from 'lucide-react';
import PublicRoute from '@/components/PublicRoute';

export const metadata: Metadata = {
  title: 'Contact | Recoverly Trust Bank',
  description: 'Secure, encrypted communication channel. Reach our 24/7 emergency line or visit one of our global offices.',
};

const offices = [
  { city: 'London', address: '1 Canada Square, Canary Wharf, London E14 5AB' },
  { city: 'New York', address: '1 World Trade Center, Suite 4500, NY 10007' },
  { city: 'Singapore', address: '8 Marina Boulevard, Marina Bay Financial Centre' },
  { city: 'Dubai', address: 'Level 42, Emirates Towers, Sheikh Zayed Road' }
];

export default function ContactPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <section className="bg-navy-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-navy-800" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy-800 mb-8 border border-navy-700">
              <Lock className="w-8 h-8 text-gold-500" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Secure Communication.</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              All communications are protected by end-to-end legal privilege and military-grade encryption. Your case details are safe.
            </p>
          </div>
        </section>

        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Lock className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-8 relative z-10">Encrypted Intake Form</h3>

              <form className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors" placeholder="secure@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scam Type</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white">
                    <option>Cryptocurrency Fraud</option>
                    <option>Forex / Trading Platform</option>
                    <option>Romance Scam</option>
                    <option>Bank Transfer Fraud</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Amount Lost</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors" placeholder="$10,000+" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Case Details</label>
                  <textarea rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-colors resize-none" placeholder="Provide a brief overview of what happened..."></textarea>
                </div>

                <button type="button" className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-lg transition-transform hover:-translate-y-1 flex justify-center items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Submit Secure Inquiry
                </button>
                <p className="text-xs text-center text-gray-500 mt-4">
                  By submitting, you agree to our strict privacy policy. Information is legally privileged.
                </p>
              </form>
            </div>

            {/* Contact Info container */}
            <div className="space-y-10">
              {/* Emergency Line */}
              <div className="bg-red-50 p-8 rounded-xl border border-red-100 flex items-start gap-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-red-900 mb-2">Urgent Bank Freeze Line</h4>
                  <p className="text-red-700 mb-4 text-sm leading-relaxed">
                    If you transferred funds within the last 48 hours, immediate action is critical. Call our emergency response team.
                  </p>
                  <a href="tel:+18005550199" className="text-3xl font-bold text-red-600 hover:text-red-700 transition-colors">
                    +1 (800) 555-0199
                  </a>
                </div>
              </div>

              {/* General Contact */}
              <div className="space-y-6 pl-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-navy-900/5 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-navy-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email (PGP Available)</p>
                    <a href="mailto:intake@recoverly.com" className="text-lg font-bold text-navy-900 hover:text-gold-500 transition-colors">intake@recoverly.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-navy-900/5 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-navy-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Global Switchboard</p>
                    <a href="tel:+442071234567" className="text-lg font-bold text-navy-900 hover:text-gold-500 transition-colors">+44 20 7123 4567</a>
                  </div>
                </div>
              </div>

              {/* Offices */}
              <div className="pl-4">
                <h4 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold-500" />
                  Global Presence
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {offices.map((office, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <h5 className="font-bold text-navy-900 mb-2">{office.city}</h5>
                      <p className="text-sm text-gray-600">{office.address}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </PublicRoute>
  );
}
