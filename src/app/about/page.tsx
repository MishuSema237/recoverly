'use client';

import { motion } from 'framer-motion';
import { Target, Users, Shield, TrendingUp, Award, Globe } from 'lucide-react';
import PublicRoute from '@/components/PublicRoute';

const AboutPage = () => {
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '33,759+', label: 'Active Investors' },
    { icon: <TrendingUp className="w-8 h-8" />, value: '$2.81B+', label: 'Total Deposits' },
    { icon: <Award className="w-8 h-8" />, value: '99.9%', label: 'Uptime' },
    { icon: <Globe className="w-8 h-8" />, value: '50+', label: 'Countries' },
  ];

  const values = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Security First',
      description: 'We prioritize the security of your investments with advanced encryption and multi-layer security protocols.',
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: 'Transparency',
      description: 'Complete transparency in all our operations, from investment strategies to fee structures.',
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Expert Team',
      description: 'Our team of financial experts and blockchain specialists ensures optimal investment strategies.',
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Innovation',
      description: 'Cutting-edge technology and innovative investment approaches to maximize your returns.',
    },
  ];

  return (
    <PublicRoute>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-red-400">Tesla Capital</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Tesla Capital is a cutting-edge investment platform offering secure cryptocurrency 
              and traditional investment opportunities with industry-leading returns and expert guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-red-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Tesla Capital, we believe that everyone deserves access to sophisticated 
                investment opportunities. Our mission is to democratize high-quality 
                investment strategies through cutting-edge technology and expert guidance.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We combine traditional financial expertise with innovative blockchain 
                technology to create a platform that delivers consistent, transparent, 
                and secure investment returns for our clients.
              </p>
              <div className="bg-red-600 text-white px-6 py-3 rounded-lg inline-block font-semibold">
                Join Our Mission
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Image Placeholder */}
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-medium">Mission Illustration</p>
                  <p className="text-sm">Image placeholder for visual content</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Tesla Capital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-red-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-white">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experts behind Tesla Capital&apos;s success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Elon Musk',
                role: 'CEO & Founder',
                description: 'Visionary leader with expertise in technology and sustainable energy.',
                avatar: 'EM',
              },
              {
                name: 'Sarah Johnson',
                role: 'Chief Investment Officer',
                description: '15+ years experience in traditional and crypto investments.',
                avatar: 'SJ',
              },
              {
                name: 'Michael Chen',
                role: 'CTO',
                description: 'Blockchain expert and security specialist.',
                avatar: 'MC',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Team Member Image Placeholder */}
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-center text-gray-500">
                    <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {member.avatar}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-red-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </PublicRoute>
  );
};

export default AboutPage;
