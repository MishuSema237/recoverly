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

  // Pages with no layout (dashboard, auth pages except signup)
  if (isDashboard || isActivateEmail || isLogin || isVerifyEmail || isResetPassword) {
    return <>{children}</>;
  }

  // Signup page: Header only, no footer
  if (isSignup) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  // All other pages: Header + Footer
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
