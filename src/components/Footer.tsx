'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Shield, Scale } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Asset Recovery', href: '/asset-recovery' },
    { name: 'Banking Services', href: '/banking' },
    { name: 'Track My Case', href: '/dashboard' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-navy-900 text-white relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <Image
                src="/RecoverlyLogo.png"
                alt="Recoverly Trust Bank"
                width={240}
                height={60}
                className="h-12 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              We are the bridge between financial loss and legal recovery. Recoverly combines the power of a specialized law firm with the security of a chartered bank to fight for what belongs to you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gold-600 transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gold-600 transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gold-600 transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gold-600 transition-all duration-300">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gold-500 font-playfair">Services & Support</h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gold-500 font-playfair">Legal Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <Mail size={18} className="text-gold-500 mt-1 flex-shrink-0 group-hover:text-white transition-colors" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Legal Inquiries</p>
                  <span className="text-gray-300 group-hover:text-white transition-colors">legal@recoverly-trust.com</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <Phone size={18} className="text-gold-500 mt-1 flex-shrink-0 group-hover:text-white transition-colors" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Client Hotline</p>
                  <span className="text-gray-300 group-hover:text-white transition-colors">+1 (888) RECOVER-ME</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <MapPin size={18} className="text-gold-500 mt-1 flex-shrink-0 group-hover:text-white transition-colors" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Headquarters</p>
                  <span className="text-gray-300 group-hover:text-white transition-colors">100 Financial District Blvd, Suite 400<br />New York, NY 10005</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Recoverly Trust Bank. Authorized Financial Institution & Legal Representative.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-gold-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gold-500 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="text-gray-500 hover:text-gold-500 text-sm transition-colors">
                Legal Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
