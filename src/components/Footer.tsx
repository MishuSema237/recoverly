'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const publicLinks = [
    { name: 'Home', href: '/' },
    { name: 'Investment Plans', href: '#investment-plans' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ];

  const authenticatedLinks = [
    { name: 'Home', href: '/' },
    { name: 'Investment Plans', href: '#investment-plans' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ];

  const links = user ? authenticatedLinks : publicLinks;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-red-500 mb-4">
              Tesla Capital
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Tesla Capital is a cutting-edge investment platform offering secure cryptocurrency 
              and traditional investment opportunities with industry-leading returns and expert guidance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  {link.href === '#investment-plans' ? (
                    <Link
                      href="/#investment-plans"
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <Link href={link.href} className="text-gray-300 hover:text-red-500 transition-colors">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-red-500" />
                <span className="text-gray-300">support@teslacapital.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-red-500" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-red-500" />
                <span className="text-gray-300">Austin, Texas, USA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Tesla Capital. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
