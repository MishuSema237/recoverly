import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Search } from 'lucide-react';
import PublicRoute from '@/components/PublicRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Recoverly Trust Bank',
  description: 'The page you are looking for has been moved or deleted.',
};

export default function NotFound() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full text-center relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-navy-800 border border-navy-700 mb-8 shadow-2xl relative">
            <ShieldAlert className="w-12 h-12 text-gold-500" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#c9933a] flex items-center justify-center border-4 border-navy-900">
              <Search className="w-3 h-3 text-white" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gold-400 mb-6 font-serif">
            Lost Funds? We can help.<br />Lost Page? Let's get you back on track.
          </h2>

          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            The link you followed may be broken, or the page may have been removed. But unlike fraudulent transactions, we can easily reverse this error.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white font-bold px-8 py-4 rounded-lg transition-all w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Return Home
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-4 rounded-lg transition-transform hover:-translate-y-1 w-full sm:w-auto shadow-lg shadow-gold-500/20"
            >
              Report a Scam
            </Link>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
