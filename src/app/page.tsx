'use client';

import dynamic from 'next/dynamic';
import PublicRoute from '@/components/PublicRoute';

const BankingHero = dynamic(() => import('@/components/BankingHero'), {
  loading: () => <div className="h-[90vh] bg-[#0a0f1a] animate-pulse" />
});

const AssetRecoverySection = dynamic(() => import('@/components/AssetRecoverySection'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
});

const ServiceSplit = dynamic(() => import('@/components/ServiceSplit'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />
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

const TrustedPartnersSection = dynamic(() => import('@/components/TrustedPartnersSection'), {
  loading: () => <div className="h-48 bg-gray-50 animate-pulse" />
});

export default function Home() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-white">
        <BankingHero />
        <TrustedPartnersSection />
        <ServiceSplit />
        <AssetRecoverySection />
        <WhyChooseUs />
        <RecentCases />
        <TestimonialsSection />
        <FAQSection />
        <SecurityCompliance />
        <FinalCTA />
      </div>
    </PublicRoute>
  );
}
