'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Benita Rodriguez',
      role: 'Investor',
      content: 'Tesla Capital provides an excellent service, be it on a business or on a personal level. I have found the company\'s advice regarding investment opportunities particularly helpful - everything is explained fully, no matter how complex the subject. I\'m happy.',
      rating: 5,
      avatar: 'BR',
    },
    {
      name: 'Frederick Johnson',
      role: 'Investor',
      content: 'I have been with Tesla Capital for over a decade now, and I can tell you that they are solid. They have a great team of experts which makes them one of the best performing fund management companies. Keep the good work Tesla Capital.',
      rating: 5,
      avatar: 'FJ',
    },
    {
      name: 'Sandra Olson',
      role: 'Investor',
      content: 'Through in-depth discussion, Tesla Capital encourages us to regularly focus and then to financially plan with us to reach our aims. This approach fully integrates life plans with financial plans, which makes life good. I love Tesla Capital always.',
      rating: 5,
      avatar: 'SO',
    },
    {
      name: 'Eric Barnes',
      role: 'Investor',
      content: 'Every time I invest with Tesla Capital I am glad I did. If not for their experts that are very professional, I wouldn\'t be able to manage my investment portfolios. You answer my questions quickly too. Thank you!',
      rating: 5,
      avatar: 'EB',
    },
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-red-600 mb-4" />
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
