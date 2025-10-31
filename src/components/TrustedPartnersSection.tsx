'use client';

import React from 'react';
import LogoLoop from './LogoLoop.jsx';

const TrustedPartnersSection = () => {
  // Top stocks and companies logos - using placeholder URLs
  // In production, replace with actual company logos from your assets
  const partnerLogos = [
    {
      src: 'https://logo.clearbit.com/apple.com',
      alt: 'Apple',
      title: 'Apple Inc.',
      href: 'https://www.apple.com'
    },
    {
      src: 'https://logo.clearbit.com/microsoft.com',
      alt: 'Microsoft',
      title: 'Microsoft Corporation',
      href: 'https://www.microsoft.com'
    },
    {
      src: 'https://logo.clearbit.com/amazon.com',
      alt: 'Amazon',
      title: 'Amazon.com Inc.',
      href: 'https://www.amazon.com'
    },
    {
      src: 'https://logo.clearbit.com/google.com',
      alt: 'Google',
      title: 'Alphabet (Google)',
      href: 'https://www.google.com'
    },
    {
      src: 'https://logo.clearbit.com/tesla.com',
      alt: 'Tesla',
      title: 'Tesla Inc.',
      href: 'https://www.tesla.com'
    },
    {
      src: 'https://logo.clearbit.com/nvidia.com',
      alt: 'NVIDIA',
      title: 'NVIDIA Corporation',
      href: 'https://www.nvidia.com'
    },
    {
      src: 'https://logo.clearbit.com/meta.com',
      alt: 'Meta',
      title: 'Meta Platforms Inc.',
      href: 'https://www.meta.com'
    },
    {
      src: 'https://logo.clearbit.com/coca-cola.com',
      alt: 'Coca-Cola',
      title: 'The Coca-Cola Company',
      href: 'https://www.coca-cola.com'
    },
    {
      src: 'https://logo.clearbit.com/nike.com',
      alt: 'Nike',
      title: 'Nike Inc.',
      href: 'https://www.nike.com'
    },
    {
      src: 'https://logo.clearbit.com/walmart.com',
      alt: 'Walmart',
      title: 'Walmart Inc.',
      href: 'https://www.walmart.com'
    },
    {
      src: 'https://logo.clearbit.com/jnj.com',
      alt: 'Johnson & Johnson',
      title: 'Johnson & Johnson',
      href: 'https://www.jnj.com'
    },
    {
      src: 'https://logo.clearbit.com/jpmorgan.com',
      alt: 'JPMorgan Chase',
      title: 'JPMorgan Chase & Co.',
      href: 'https://www.jpmorganchase.com'
    },
    {
      src: 'https://logo.clearbit.com/visa.com',
      alt: 'Visa',
      title: 'Visa Inc.',
      href: 'https://www.visa.com'
    },
    {
      src: 'https://logo.clearbit.com/mastercard.com',
      alt: 'Mastercard',
      title: 'Mastercard Inc.',
      href: 'https://www.mastercard.com'
    },
    {
      src: 'https://logo.clearbit.com/disney.com',
      alt: 'Disney',
      title: 'The Walt Disney Company',
      href: 'https://www.disney.com'
    },
    {
      src: 'https://logo.clearbit.com/netflix.com',
      alt: 'Netflix',
      title: 'Netflix Inc.',
      href: 'https://www.netflix.com'
    },
    {
      src: 'https://logo.clearbit.com/intel.com',
      alt: 'Intel',
      title: 'Intel Corporation',
      href: 'https://www.intel.com'
    },
    {
      src: 'https://logo.clearbit.com/amd.com',
      alt: 'AMD',
      title: 'Advanced Micro Devices',
      href: 'https://www.amd.com'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Trusted Investment Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tesla Capital invests in top-performing stocks from the world&apos;s leading companies. 
            These are the powerful corporations on the stock exchange market where we strategically 
            place your investments to multiply your money.
          </p>
        </div>

        <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {React.createElement(LogoLoop as any, {
            logos: partnerLogos,
            speed: 120,
            direction: 'left',
            logoHeight: 48,
            gap: 40,
            pauseOnHover: true,
            scaleOnHover: true,
            fadeOut: true,
            fadeOutColor: '#ffffff',
            ariaLabel: 'Trusted investment partners - top stocks and companies'
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            <strong>How it works:</strong> Tesla Capital takes your investment funds and strategically 
            allocates them across these top-performing stocks. Our expert team monitors market trends 
            and identifies the best opportunities. We also engage in crypto mining operations using 
            your capital. All you do is wait for the days on your plan and watch your money increase - 
            we handle all the complex work!
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartnersSection;

