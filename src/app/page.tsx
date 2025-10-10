'use client';

import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import PublicRoute from '@/components/PublicRoute';

// Lazy load components for better performance
const HeroSection = dynamic(() => import('@/components/HeroSection'), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse" />
});

const InvestmentPlans = dynamic(() => import('@/components/InvestmentPlans'), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse" />
});

const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse" />
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse" />
});

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse" />
});

const NewsletterSection = dynamic(() => import('@/components/NewsletterSection'), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse" />
});

export default function Home() {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <PublicRoute>
      <div className="min-h-screen">
        <HeroSection />
        <InvestmentPlans />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <NewsletterSection />
      </div>
    </PublicRoute>
  );
}
