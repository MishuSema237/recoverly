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

  // Background - Dark elegant gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#111827'); // Gray 900
  gradient.addColorStop(1, '#000000'); // Black
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add a subtle red accent/glow
  const glow = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 500);
  glow.addColorStop(0, 'rgba(220, 38, 38, 0.1)'); // Red with low opacity
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#374151'; // Gray 700
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
    ctx.fillStyle = i < rating ? '#ef4444' : '#4b5563'; // Red stars
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
  ctx.fillStyle = '#9ca3af'; // Gray 400
  ctx.font = 'italic 24px Inter, sans-serif';
  ctx.fillText(`- ${author}`, canvas.width / 2, starsY + 50);

  return canvas.toDataURL('image/png');
};

const TestimonialsSection = () => {
  const reviews = [
    {
      text: 'Tesla Capital has transformed my investment portfolio. The returns are consistent and the platform is easy to use. Highly recommended!',
      rating: 5,
      author: 'Benita Rodriguez'
    },
    {
      text: 'Outstanding service and impressive returns. The team is professional and always responsive to questions.',
      rating: 5,
      author: 'Frederick Johnson'
    },
    {
      text: 'Great experience overall. The investment plans are clear and the profits are delivered as promised.',
      rating: 4,
      author: 'Sandra Olson'
    },
    {
      text: 'Very satisfied with my investment. The daily earnings are consistent and the withdrawal process is smooth.',
      rating: 5,
      author: 'Eric Barnes'
    },
    {
      text: 'Excellent platform for growing wealth. The referral program is a great bonus feature.',
      rating: 4,
      author: 'Michael Chen'
    },
    {
      text: 'Professional service with transparent processes. My investments have been performing well.',
      rating: 5,
      author: 'Sarah Williams'
    },
    {
      text: 'Good returns and reliable service. The customer support team is helpful and knowledgeable.',
      rating: 4,
      author: 'David Thompson'
    },
    {
      text: 'I\'ve been investing for 6 months now and the results exceed my expectations. Thank you Tesla Capital!',
      rating: 5,
      author: 'Emily Davis'
    }
  ];

  const testimonials = useMemo(() => {
    if (typeof window === 'undefined') {
      // Return placeholder during SSR
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