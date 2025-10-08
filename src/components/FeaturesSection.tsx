'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  BarChart3, 
  Zap, 
  Users, 
  Shield, 
  Mail, 
  ThumbsUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Top Technical Analysis',
      description: 'Identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume.',
      image: '/DrawKit - Economy & Finance/PNG/9 - ECONOMY ANALYSIS.png',
      reverse: false,
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'High Performance',
      description: 'Our system is highly performant and always ready for our investors any time any day.',
      image: '/DrawKit - Economy & Finance/PNG/1 - REBUILD THE ECONOMY.png',
      reverse: true,
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Full Expert Support',
      description: 'We have experts at hand ready to guide you along the way for a great investment experience.',
      image: '/DrawKit - Economy & Finance/PNG/3 - JOB LOOKING.png',
      reverse: false,
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Direct Email & SMS Signals',
      description: 'We always keep our investors notified through emails and SMS so that they can take action when necessary.',
      image: '/DrawKit - Economy & Finance/PNG/4 - BUDGETTING.png',
      reverse: true,
    },
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      title: 'Highly Recommended',
      description: 'Tesla Capital is highly recommended and well appreciated in the industry. You are safe with us.',
      image: '/DrawKit - Economy & Finance/PNG/6 - FINANCES.png',
      reverse: false,
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Join a Growing Community',
      description: 'Join a community of Tesla Capital investors to increase and diversify your investment portfolio.',
      image: '/DrawKit - Economy & Finance/PNG/5 - RECRUITING.png',
      reverse: true,
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <Image
              src="/tesla-capital-logo.png"
              alt="Tesla Capital Logo"
              width={120}
              height={120}
              className="rounded-2xl shadow-lg"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Everything you need to fast track your investment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Our comprehensive platform provides all the tools and support you need 
            to make informed investment decisions and maximize your returns.
          </motion.p>
        </div>

        {/* Features with alternating layout */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20 relative`}
            >
              {/* Mobile Background Image */}
              <div className="md:hidden absolute inset-0 opacity-10">
                <Image
                  src={feature.image}
                  alt={`${feature.title} Background`}
                  fill
                  className="object-cover rounded-3xl"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-600 p-4 rounded-xl text-white shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center space-x-2 text-red-600 font-semibold">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Image with overlapping design - Hidden on mobile */}
              <div className="flex-1 relative hidden md:block">
                <div className="relative">
                  {/* Background decoration */}
                  <div className={`absolute -top-8 ${feature.reverse ? '-left-8' : '-right-8'} w-32 h-32 bg-red-100 rounded-full opacity-50`}></div>
                  <div className={`absolute -bottom-8 ${feature.reverse ? '-right-8' : '-left-8'} w-24 h-24 bg-gray-100 rounded-full opacity-50`}></div>
                  
                  {/* Main image */}
                  <div className="relative z-10 bg-gradient-to-br from-red-50 to-gray-50 rounded-3xl p-8">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={400}
                      height={300}
                      className="rounded-2xl mx-auto"
                    />
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-32 bg-gradient-to-br from-gray-900 to-red-900 rounded-3xl p-12 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full opacity-10 transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full opacity-5 transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <Image
                  src="/tesla-capital-logo.png"
                  alt="Tesla Capital Logo"
                  width={80}
                  height={80}
                  className="rounded-xl"
                />
              </div>
              <h2 className="text-4xl font-bold mb-4">
                How Tesla Capital Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our streamlined investment process is designed to be simple, secure, and profitable. 
                Here&apos;s how you can start building your wealth with Tesla Capital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                  className="text-center relative bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm"
                >
                  <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
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
