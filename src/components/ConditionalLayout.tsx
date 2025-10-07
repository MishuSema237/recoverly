'use client';

import { usePathname } from 'next/navigation';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isActivateEmail = pathname === '/activate-email';

  if (isDashboard || isActivateEmail) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}
