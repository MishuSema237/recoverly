'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import React from 'react';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isActivateEmail = pathname === '/activate-email';
  const isLogin = pathname === '/login';
  const isSignup = pathname === '/signup';
  const isVerifyEmail = pathname === '/verify-email';
  const isResetPassword = pathname === '/reset-password';

  if (isDashboard || isActivateEmail || isLogin || isSignup || isVerifyEmail || isResetPassword) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
