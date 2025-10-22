'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface InstantLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  prefetch?: boolean;
}

const InstantLink: React.FC<InstantLinkProps> = ({ 
  href, 
  children, 
  className = '', 
  onClick,
  prefetch = true 
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Show loading state immediately
    setIsNavigating(true);

    // Navigate immediately
    router.push(href);

    // Reset loading state after a short delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  };

  return (
    <Link 
      href={href} 
      className={`${className} ${isNavigating ? 'opacity-70 pointer-events-none' : ''}`}
      onClick={handleClick}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
};

export default InstantLink;









