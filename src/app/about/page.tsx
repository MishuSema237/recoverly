import type { Metadata } from 'next';
import { Scale, Users, Target, ShieldCheck } from 'lucide-react';
import PublicRoute from '@/components/PublicRoute';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | Recoverly Trust Bank',
  description: 'Founded by ex-prosecutors and forensic accountants to bridge the gap between law enforcement and banking.',
};

const team = [
  {
    name: 'Jonathan Sterling',
    role: 'Chief Executive Officer',
    bio: 'Former Federal Prosecutor with 15 years investigating international wire fraud and financial syndicates.',
    image: 'https://placehold.co/400x400/1e293b/c9933a?text=Jonathan+Sterling'
  },
  {
    name: 'Elena Rostova',
    role: 'Head of Forensic Accounting',
    bio: 'Certified fraud examiner specializing in blockchain tracing and offshore liability mapping.',
    image: 'https://placehold.co/400x400/1e293b/c9933a?text=Elena+Rostova'
  },
  {
    name: 'Marcus Chen',
    role: 'Chief Legal Officer',
    bio: 'International banking law expert. Drafts our cross-border levies and legal demands.',
    image: 'https://placehold.co/400x400/1e293b/c9933a?text=Marcus+Chen'
  }
];

export default function AboutPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gray-50">

        {/* Hero */}
        <section className="bg-navy-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Mission.</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We bridge the gap between complex law enforcement and rigid banking systems to recover what rightfully belongs to you.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-gold-500 uppercase mb-3">The Origin</h2>
                <h3 className="text-4xl font-bold text-navy-900 mb-6">Built by Investigators.</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Recoverly was founded when a group of ex-prosecutors and intelligence-grade forensic accountants realized a fundamental flaw in the financial system. When complex fraud occurs, traditional banks often reject liability, and local police lack the international jurisdiction to pursue the funds.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We built our own financial institution coupled with a powerhouse legal network. By holding banking licenses and utilizing our legal authority, we can trace, demand, and repatriate funds faster than any traditional law firm.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 h-64 rounded-xl overflow-hidden relative">
                  <img src="https://placehold.co/600x800/e2e8f0/1e293b?text=Legal+Office+600x800" alt="Legal office" className="object-cover w-full h-full" />
                </div>
                <div className="bg-gray-100 h-64 rounded-xl overflow-hidden relative mt-8">
                  <img src="https://placehold.co/600x800/e2e8f0/1e293b?text=Financial+Graphs+600x800" alt="Financial graphs" className="object-cover w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-navy-900/5 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-gold-500" />
                </div>
                <h4 className="text-xl font-bold text-navy-900 mb-4">Precision</h4>
                <p className="text-gray-600">Every dispute is anchored in incontrovertible forensic evidence.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-navy-900/5 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-gold-500" />
                </div>
                <h4 className="text-xl font-bold text-navy-900 mb-4">Authority</h4>
                <p className="text-gray-600">We don't ask politely. We leverage international banking regulations.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-navy-900/5 rounded-full flex items-center justify-center mb-6">
                  <Scale className="w-8 h-8 text-gold-500" />
                </div>
                <h4 className="text-xl font-bold text-navy-900 mb-4">Justice</h4>
                <p className="text-gray-600">Our success is tied to yours. We operate on a No Win, No Fee basis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-24 bg-navy-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-gold-500 uppercase mb-3">Our Board</h2>
              <h3 className="text-4xl font-bold">Leadership Team</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {team.map((member, idx) => (
                <div key={idx} className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700/50">
                  <div className="h-64 relative bg-navy-950">
                    <img src={member.image} alt={member.name} className="object-cover w-full h-full opacity-90" />
                  </div>
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-white mb-1">{member.name}</h4>
                    <p className="text-gold-500 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </PublicRoute>
  );
}
