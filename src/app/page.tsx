'use client';

import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import PublicRoute from '@/components/PublicRoute';

// Lazy load components for better performance
const TrustHero = dynamic(() => import('@/components/TrustHero'), {
  loading: () => <div className="h-screen bg-navy-900 animate-pulse" />
});

const ServiceSplit = dynamic(() => import('@/components/ServiceSplit'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />
});

const ProcessSteps = dynamic(() => import('@/components/ProcessSteps'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
});

const ProofSection = dynamic(() => import('@/components/ProofSection'), {
  loading: () => <div className="h-96 bg-navy-900 animate-pulse" />
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
});

const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const RecentCases = dynamic(() => import('@/components/RecentCases'), {
  loading: () => <div className="h-96 bg-navy-900 animate-pulse" />
});

const SecurityCompliance = dynamic(() => import('@/components/SecurityCompliance'), {
  loading: () => <div className="h-48 bg-white animate-pulse" />
});

const FinalCTA = dynamic(() => import('@/components/FinalCTA'), {
  loading: () => <div className="h-96 bg-navy-900 animate-pulse" />
});

export default function Home() {
  const { loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white">
        <TrustHero />
        <ServiceSplit />
        <ProcessSteps />
        <ProofSection />
        <TestimonialsSection />
        <WhyChooseUs />
        <RecentCases />
        <FAQSection />
        <SecurityCompliance />
        <FinalCTA />
      </div>
    </PublicRoute>
  );
}
