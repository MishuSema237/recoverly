'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

// Testimonial Screenshots
import Proof1 from '@/assets/images_for_pages/testimonials/Screenshot 2026-03-12 163718.png';
import Proof2 from '@/assets/images_for_pages/testimonials/Screenshot 2026-03-12 163757.png';
import Proof3 from '@/assets/images_for_pages/testimonials/Screenshot 2026-03-12 163838.png';
import Proof4 from '@/assets/images_for_pages/testimonials/Screenshot 2026-03-12 163913.png';

interface TestimonialData {
  image: any;
  title: string;
  tag: string;
  description: string;
}

const testimonialData: TestimonialData[] = [
  {
    image: Proof1,
    title: 'Crypto Romance Recovery',
    tag: 'Case Log #4492 - $85,000 Recovered',
    description: 'User lost their life savings to a "Liquidity Mining" scam. Recoverly traced the funds across three international exchanges, issued a legal freeze, and successfully repatriated $85,400 within 14 days.'
  },
  {
    image: Proof2,
    title: 'BEC Bank Wire Fraud',
    tag: 'Case Log #5102 - $120,000 Recovered',
    description: 'A business owner was targeted by a Business Email Compromise scam. $120,000 was diverted to a rogue offshore account. Our team intervened with the receiving bank, stopping the cash-out and reversing the wire.'
  },
  {
    image: Proof3,
    title: 'Phishing Asset Reclamation',
    tag: 'Case Log #3981 - Full Payout Secured',
    description: 'After a sophisticated phishing attack drained a client\'s safe vault, Recoverly\'s forensic accountants provided incontrovertible evidence of illegal access, forcing the custodial platform to honor a full loss reimbursement.'
  },
  {
    image: Proof4,
    title: 'Unauthorized Leverage Debt',
    tag: 'Case Log #4220 - $35,000 Debt Expunged',
    description: 'Identity theft led to $35,000 in fraudulent loan applications. Our legal division successfully expunged the illegitimate debts and fully restored the client\'s credit standing with major financial bureaus.'
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonialData.length) % testimonialData.length);

  useEffect(() => {
    const interval = setInterval(next, 10000);
    return () => clearInterval(interval);
  }, []);

  const current = testimonialData[currentIndex];

  if (!current) return null;

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-50 border border-gold-100 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-gold-600 rounded-full animate-pulse"></span>
            <span className="text-gold-600 font-black tracking-widest uppercase text-[10px]">Forensic Registry</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-navy-900 uppercase tracking-tighter">Validated Proof</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto font-medium lowercase">Actual forensic outcomes and client cases from our live recovery ledger.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row min-h-[500px]">
                {/* Visual Proof Side */}
                <div className="w-full md:w-3/5 relative min-h-[400px] bg-gray-100 p-6">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200">
                    <Image 
                      src={current.image} 
                      alt={current.title}
                      fill
                      className="object-contain p-4 transition-transform duration-700 hover:scale-105"
                      priority
                    />
                  </div>
                </div>

                {/* Information Side */}
                <div className="w-full md:w-2/5 p-8 mobile:p-12 flex flex-col justify-center bg-navy-900 text-white relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="w-32 h-32 text-gold-500" />
                  </div>

                  <div className="w-12 h-12 bg-gold-500/20 rounded-2xl flex items-center justify-center text-gold-500 mb-8 border border-gold-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>

                  <div className="relative mb-8">
                    <Quote className="w-12 h-12 text-gold-500/10 absolute -top-12 -left-6" />
                    <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-2 leading-tight">
                      {current.title}
                    </h4>
                    <p className="text-gold-500 font-mono text-[10px] font-black tracking-widest uppercase mb-6 bg-gold-500/10 inline-block px-2 py-1 rounded">
                      {current.tag}
                    </p>
                    <div className="relative border-l-2 border-gold-500/40 pl-6 py-1">
                      <p className="text-base text-gray-200 leading-relaxed font-medium italic">
                        "{current.description}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Forensic Registry Authenticated</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold-500/50" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Jurisdictional Authority: Confirmed</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-12">
            <button 
              onClick={prev}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-gold-500 transition-all border border-gray-100 shadow-lg active:scale-90 group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="flex gap-3">
              {testimonialData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === currentIndex ? 'w-10 bg-navy-900' : 'w-3 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={next}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-gold-500 transition-all border border-gray-100 shadow-lg active:scale-90 group"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
