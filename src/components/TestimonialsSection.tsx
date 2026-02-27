'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  _id?: string;
  name: string;
  content: string;
  rating: number;
  picture: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    name: 'Sarah Jenkins',
    content: 'I lost $45,000 to a crypto romance scam. The police did nothing. Recoverly filed legal action and got 80% of my funds back in 3 weeks! The professionalism and speed was unexpected.',
    rating: 5.0,
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: 'Michael Torres',
    content: 'My bank refused to refund an unauthorized $12k transaction. Recoverly used a court order to force them to pay up. Amazing service. They know the banking laws better than the bankers do.',
    rating: 4.8,
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000'
  }
];

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setTestimonials(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials');
      }
    };
    fetchTestimonials();
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const interval = setInterval(next, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-50 border border-gold-100 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-gold-600 rounded-full animate-pulse"></span>
            <span className="text-gold-600 font-black tracking-widest uppercase text-[10px]">Intelligence Ledger</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-navy-900 uppercase tracking-tighter">Validated Success</h2>
        </div>

        <div className="relative h-[600px] md:h-[700px] w-full rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="absolute inset-0"
            >
              {/* Background with zoom effect */}
              <div className="absolute inset-0 transform transition-transform duration-[8000ms] group-hover:scale-110">
                <img 
                  src={testimonials[currentIndex].picture} 
                  alt={testimonials[currentIndex].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-navy-900/20"></div>
                <div className="absolute inset-0 bg-navy-900/30"></div>
              </div>

              {/* Centered Content */}
              <div className="relative h-full z-10 flex flex-col items-center justify-center text-center px-8 md:px-20 max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-gold-500/10 backdrop-blur-xl border border-gold-500/20 rounded-3xl flex items-center justify-center mb-10">
                  <Quote className="w-10 h-10 text-gold-500" />
                </div>
                
                <p className="text-2xl md:text-4xl font-black text-white leading-tight mb-12 drop-shadow-2xl">
                  "{testimonials[currentIndex].content}"
                </p>

                <div className="flex flex-col items-center space-y-6">
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(testimonials[currentIndex].rating) 
                          ? 'text-gold-500 fill-gold-500' 
                          : (i < testimonials[currentIndex].rating ? 'text-gold-500 fill-gold-500 opacity-50' : 'text-gray-400')
                        }`} 
                      />
                    ))}
                    <span className="text-gold-500 font-black text-sm ml-2">{testimonials[currentIndex].rating.toFixed(1)}</span>
                  </div>

                  <div className="text-center">
                    <h4 className="text-3xl font-black text-gold-500 uppercase tracking-tighter">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-300 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 opacity-80">Verified Protocol Recipient</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8 z-20">
            <button 
              onClick={prev}
              className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-900 transition-all border border-white/10 hover:border-gold-500 shadow-xl"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            {/* Slide Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === currentIndex ? 'w-12 bg-gold-500' : 'w-4 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={next}
              className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-gold-500 hover:text-navy-900 transition-all border border-white/10 hover:border-gold-500 shadow-xl"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
