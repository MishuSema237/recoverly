'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import CircularGallery from './CircularGallery.jsx';

// Function to create a review card image with text and star ratings
const createReviewCardImage = (reviewText: string, rating: number, author: string): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  canvas.width = 800;
  canvas.height = 600;

  // Background - Navy gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#0B1626'); // Navy 900
  gradient.addColorStop(1, '#173653'); // Navy 700
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add a subtle gold accent/glow
  const glow = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 500);
  glow.addColorStop(0, 'rgba(201, 147, 58, 0.1)'); // Gold with low opacity
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#2E5A8D'; // Navy 500
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

  // Text properties
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Dynamic font size based on text length
  let fontSize = 32;
  if (reviewText.length > 150) fontSize = 28;
  if (reviewText.length > 200) fontSize = 24;

  ctx.font = `bold ${fontSize}px Inter, sans-serif`;
  const maxWidth = canvas.width - 120; // More padding
  const lineHeight = fontSize * 1.5;

  // Word wrap logic
  const words = reviewText.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  // Calculate total text height to center vertically
  const totalTextHeight = lines.length * lineHeight;
  const startY = (canvas.height - totalTextHeight) / 2 - 40; // Shift up slightly for stars/author

  // Draw review text lines
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });

  // Draw stars
  const starSize = 30;
  const starSpacing = 40;
  const starsX = (canvas.width - (starSpacing * 5 - (starSpacing - starSize))) / 2; // Correct centering
  const starsY = startY + totalTextHeight + 40;

  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i < rating ? '#C9933A' : '#4b5563'; // Gold stars
    ctx.beginPath();
    // Draw star shape
    const cx = starsX + i * starSpacing + starSize / 2;
    const cy = starsY;
    const spikes = 5;
    const outerRadius = starSize / 2;
    const innerRadius = starSize / 4;

    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let j = 0; j < spikes; j++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  // Author name
  ctx.fillStyle = '#9FB3CB'; // Navy 200
  ctx.font = 'italic 24px Inter, sans-serif';
  ctx.fillText(`- ${author}`, canvas.width / 2, starsY + 50);

  return canvas.toDataURL('image/png');
};

const TestimonialsSection = () => {
  const reviews = [
    {
      text: 'I lost $45,000 to a crypto romance scam. The police did nothing. Recoverly filed legal action and got 80% of my funds back in 3 weeks!',
      rating: 5,
      author: 'Sarah Jenkins'
    },
    {
      text: 'My bank refused to refund an unauthorized $12k transaction. Recoverly used a court order to force them to pay up. Amazing service.',
      rating: 5,
      author: 'Michael Torres'
    },
    {
      text: 'I was skeptical at first, but their legal team is legit. They recovered my stolen Bitcoin from a fake exchange.',
      rating: 5,
      author: 'David Chen'
    },
    {
      text: 'Finally, a service that actually fights for victims. The process was transparent and I could track my case every step of the way.',
      rating: 5,
      author: 'Amanda Lewis'
    },
    {
      text: 'Professional, aggressive against scammers, and kind to clients. Recoverly saved my retirement savings.',
      rating: 5,
      author: 'Robert Wilson'
    },
    {
      text: 'They know exactly how to deal with banks. My claim was approved 48 hours after Recoverly stepped in.',
      rating: 5,
      author: 'Jessica White'
    }
  ];

  const testimonials = useMemo(() => {
    if (typeof window === 'undefined') {
      return reviews.map(review => ({
        image: '',
        text: `${review.author} - ${review.rating}★`
      }));
    }
    return reviews.map(review => ({
      image: createReviewCardImage(review.text, review.rating, review.author),
      text: `${review.author} - ${review.rating}★`
    }));
  }, []);

  const recentWins = [
    {
      type: 'Crypto Scam Recovery',
      amount: '$145,000.00',
      date: '2 Days Ago',
    },
    {
      type: 'Bank Wire Reversal',
      amount: '$28,400.00',
      date: '4 Hours Ago',
    },
    {
      type: 'Credit Card Fraud',
      amount: '$9,250.00',
      date: 'Just Now',
    },
  ];

  return (
    <section className="py-12 mobile:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Customer Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-10 mobile:mb-16">
            <span className="text-gold-600 font-bold tracking-wider uppercase text-xs mobile:text-sm">Success Stories</span>
            <h2 className="text-2xl mobile:text-3xl lg:text-5xl font-bold text-navy-900 mt-2 font-playfair">
              Victory for Victims
            </h2>
            <p className="text-base mobile:text-xl text-gray-600 max-w-2xl mx-auto mt-3 mobile:mt-4">
              We have helped thousands of people reclaim what is rightfully theirs.
            </p>
          </div>

          {/* Circular Gallery for Testimonials */}
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery bend={3} textColor="#1F466F" borderRadius={0.05} scrollEase={0.02} items={testimonials} />
          </div>
        </div>

        {/* Recent Wins */}
        <div className="bg-white rounded-3xl p-6 mobile:p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-8 mobile:mb-12">
            <h2 className="text-xl mobile:text-2xl lg:text-3xl font-bold text-navy-900 mb-3 mobile:mb-4 font-playfair">
              Recent Case Victories
            </h2>
            <p className="text-sm mobile:text-base text-gray-600">
              Live updates of funds recovered for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentWins.map((win, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 mobile:p-8 bg-navy-50 rounded-2xl border border-navy-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mobile:w-16 mobile:h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-3 mobile:mb-4 text-xl mobile:text-2xl">
                  ⚖️
                </div>
                <h3 className="text-lg mobile:text-xl font-bold text-navy-900 mb-1.5 mobile:mb-2 text-sm mobile:text-base">
                  {win.type}
                </h3>
                <p className="text-gold-600 font-bold text-xl mobile:text-2xl font-mono mb-1.5 mobile:mb-2">
                  {win.amount}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {win.date}
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
