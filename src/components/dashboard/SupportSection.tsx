'use client';

import { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Clock, Phone, MapPin, Globe, Users, Shield, Zap } from 'lucide-react';

const SupportSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle support form submission
    console.log('Support request:', formData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          Get help and contact our support team. Send us a message and we&apos;ll get back to you as soon as possible.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support Form - Left Side */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Send us a Message</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="What can we help you with?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Please describe your issue or question in detail..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information & Support Details - Right Side */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Get in Touch</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@tesla-capital.com</p>
                    <p className="text-xs text-gray-500">Response within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Live Chat</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                    <p className="text-xs text-gray-500">Instant response</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Phone Support</p>
                    <p className="text-sm text-gray-600">+381 11 30 20 030</p>
                    <p className="text-xs text-gray-500">Mon-Fri 8:00-16:00 CET</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Our Office</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Tesla Capital JSC Belgrade</p>
                    <p className="text-sm text-gray-600">Bulevar Mihajla Pupina 115Đ</p>
                    <p className="text-sm text-gray-600">Beograd, Serbia</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-sm text-gray-600">Monday - Friday: 08:00 – 16:00h</p>
                    <p className="text-sm text-gray-600">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Help</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Help Center</p>
                    <p className="text-sm text-gray-600">Browse our knowledge base</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Community Forum</p>
                    <p className="text-sm text-gray-600">Connect with other investors</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Security Center</p>
                    <p className="text-sm text-gray-600">Report security issues</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-red-600" />
                Response Times
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">General Inquiries:</span>
                  <span className="font-medium text-gray-900">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Technical Issues:</span>
                  <span className="font-medium text-gray-900">12 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Urgent Matters:</span>
                  <span className="font-medium text-gray-900">2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
