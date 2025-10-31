'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CircularGallery from './CircularGallery.jsx';

const TestimonialsSection = () => {
  const testimonials = [
    {
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop',
      text: 'Benita Rodriguez - Investor'
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      text: 'Frederick Johnson - Investor'
    },
    {
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop',
      text: 'Sandra Olson - Investor'
    },
    {
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop',
      text: 'Eric Barnes - Investor'
    },
    {
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop',
      text: 'Michael Chen - Investor'
    },
    {
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop',
      text: 'Sarah Williams - Investor'
    },
    {
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop',
      text: 'David Thompson - Investor'
    },
    {
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop',
      text: 'Emily Davis - Investor'
    }
  ];

  const topInvestors = [
    {
      name: 'Lina Gerald',
      amount: '$4,500,000.00',
      avatar: 'LG',
    },
    {
      name: 'Marshal Garry',
      amount: '$3,934,754.92',
      avatar: 'MG',
    },
    {
      name: 'Stefan Günter',
      amount: '$2,850,000.00',
      avatar: 'SG',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Customer Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What our customers say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our satisfied investors 
              have to say about their experience with Tesla Capital.
            </p>
          </div>

          {/* Circular Gallery for Testimonials */}
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} items={testimonials} />
          </div>
        </div>

        {/* Top Investors */}
        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Top Investors
            </h2>
            <p className="text-gray-600">
              Meet some of our most successful investors who have achieved remarkable returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topInvestors.map((investor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {investor.avatar}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {investor.name}
                </h3>
                <p className="text-red-600 font-bold text-lg">
                  Invest Amount {investor.amount}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;