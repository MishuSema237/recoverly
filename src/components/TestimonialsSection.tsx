'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  picture: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    name: 'Sarah Jenkins',
    role: 'Fraud Recovery Client',
    content: 'I lost $45,000 to a crypto romance scam. The police did nothing. Recoverly filed legal action and got 80% of my funds back in 3 weeks! The professionalism and speed was unexpected.',
    rating: 5.0,
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: 'Michael Torres',
    role: 'Corporate Banking Client',
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
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-50 border border-gold-100 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-gold-600 rounded-full animate-pulse"></span>
            <span className="text-gold-600 font-black tracking-widest uppercase text-[10px]">Intelligence Ledger</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-navy-900 uppercase tracking-tighter">Validated Success</h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="w-full"
            >
              <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row min-h-[450px]">
                {/* Image Side */}
                <div className="w-full md:w-2/5 relative h-64 md:h-auto">
                   <img 
                    src={testimonials[currentIndex].picture} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-navy-900/20"></div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-3/5 p-8 mobile:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.floor(testimonials[currentIndex].rating) 
                          ? 'text-gold-500 fill-gold-500' 
                          : 'text-gray-200 fill-gray-100'
                        }`} 
                      />
                    ))}
                  </div>

                  <div className="relative mb-8">
                    <Quote className="w-12 h-12 text-gold-500/10 absolute -top-6 -left-6" />
                    <p className="text-xl mobile:text-2xl font-bold text-navy-900 leading-relaxed italic relative z-10">
                      "{testimonials[currentIndex].content}"
                    </p>
                  </div>

                  <div>
                    <h4 className="text-2xl font-black text-navy-900 uppercase tracking-tighter">{testimonials[currentIndex].name}</h4>
                    <p className="text-gold-600 font-black tracking-widest uppercase text-[10px] mt-1">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-12">
            <button 
              onClick={prev}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-gold-500 transition-all border border-gray-100 shadow-lg active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
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
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-gold-500 transition-all border border-gray-100 shadow-lg active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
