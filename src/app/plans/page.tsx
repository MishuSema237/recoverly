'use client';

import InvestmentPlans from '@/components/InvestmentPlans';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PlansPage() {
  return (
    <ProtectedRoute requireEmailVerification={true}>
      <div className="min-h-screen">
        <InvestmentPlans />
      </div>
    </ProtectedRoute>
  );
}
