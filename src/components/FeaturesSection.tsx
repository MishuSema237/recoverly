'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  BarChart3,
  Zap,
  Users,
  Mail,
  ThumbsUp,
  CheckCircle,
  ArrowRight,
  Globe,
  ShieldCheck
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Top Technical Analysis',
      description: 'Identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume.',
      image: '/DrawKit - Economy & Finance/PNG/9 - ECONOMY ANALYSIS.png',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'High Performance',
      description: 'Our system is highly performant and always ready for our investors any time any day.',
      image: '/DrawKit - Economy & Finance/PNG/1 - REBUILD THE ECONOMY.png',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Full Expert Support',
      description: 'We have experts at hand ready to guide you along the way for a great investment experience.',
      image: '/DrawKit - Economy & Finance/PNG/3 - JOB LOOKING.png',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Direct Email & SMS Signals',
      description: 'We always keep our investors notified through emails and SMS so that they can take action when necessary.',
      image: '/DrawKit - Economy & Finance/PNG/4 - BUDGETTING.png',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: <ThumbsUp className="w-6 h-6" />,
      title: 'Highly Recommended',
      description: 'Recoverly is highly recommended and well appreciated in the industry. You are safe with us.',
      image: '/DrawKit - Economy & Finance/PNG/6 - FINANCES.png',
      color: 'bg-gold-100 text-[#c9933a]',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Join a Growing Community',
      description: 'Join a community of Recoverly investors to increase and diversify your investment portfolio.',
      image: '/DrawKit - Economy & Finance/PNG/5 - RECRUITING.png',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Create an Account',
      description: 'Create an account with us which can be done in less than 2 minutes with your email address.',
    },
    {
      number: '2',
      title: 'Choose Plan',
      description: 'Choose a plan from a list of available plans. There is a plan for everybody.',
    },
    {
      number: '3',
      title: 'Get Profit',
      description: 'That\'s it. You are good to go. Just relax and watch your profits trickle in based on the plan you choose.',
    },
  ];

  return (
    <section className="py-12 mobile:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <Image
              src="/RecoverlyLogo.png"
              alt="Recoverly Logo"
              width={100}
              height={100}
              className="rounded-2xl shadow-lg"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl mobile:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 mobile:mb-6"
          >
            Why Choose Recoverly?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base mobile:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Our comprehensive platform provides all the tools and support you need
            to make informed investment decisions and maximize your returns.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="h-48 relative bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${feature.color.split(' ')[0]}`}></div>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={200}
                  height={150}
                  className="object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5 mobile:p-8">
                <div className="flex items-center mb-3 mobile:mb-4">
                  <div className={`w-8 h-8 mobile:w-10 mobile:h-10 rounded-lg ${feature.color} flex items-center justify-center mr-3 scale-90 mobile:scale-100`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg mobile:text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-[#0b1626] to-[#1a2b4a] rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9933a] rounded-full opacity-10 blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full opacity-10 blur-3xl transform -translate-x-24 translate-y-24"></div>

          <div className="relative z-10">
            <div className="text-center mb-10 mobile:mb-16">
              <h2 className="text-2xl mobile:text-3xl lg:text-4xl font-bold mb-4 mobile:mb-6">
                How Recoverly Works
              </h2>
              <p className="text-base mobile:text-xl text-gray-300 max-w-3xl mx-auto">
                Our streamlined investment process is designed to be simple, secure, and profitable.
                Here&apos;s how you can start building your wealth with Recoverly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                  className="text-center relative bg-white bg-opacity-5 rounded-2xl p-8 backdrop-blur-sm border border-white/10 hover:bg-opacity-10 transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-[#c9933a] to-[#b08132] w-12 h-12 mobile:w-16 mobile:h-16 rounded-xl mobile:rounded-2xl flex items-center justify-center text-xl mobile:text-2xl font-bold mx-auto mb-4 mobile:mb-6 shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                    {step.number}
                  </div>
                  <h3 className="text-lg mobile:text-xl font-bold mb-3 mobile:mb-4">
                    {step.title}
                  </h3>
                  <p className="text-sm mobile:text-base text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
