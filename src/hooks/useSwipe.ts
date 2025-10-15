import { useEffect, useRef } from 'react';

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean;
}

export const useSwipe = (options: SwipeOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchmoveEvent = true,
    trackMouse = false,
  } = options;

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    touchEndY.current = e.changedTouches[0].clientY;
    handleSwipe();
  };

  const handleSwipe = () => {
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if swipe is from extreme left edge (within 50px of left edge)
    const isFromLeftEdge = touchStartX.current <= 50;

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > threshold && isFromLeftEdge) {
        // Swipe right from left edge
        onSwipeRight?.();
      } else if (deltaX < -threshold) {
        // Swipe left
        onSwipeLeft?.();
      }
    } else {
      // Vertical swipe
      if (deltaY > threshold) {
        // Swipe down
        onSwipeDown?.();
      } else if (deltaY < -threshold) {
        // Swipe up
        onSwipeUp?.();
      }
    }
  };

  useEffect(() => {
    const element = document.body;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [threshold, preventDefaultTouchmoveEvent]);

  return {
    touchStartX: touchStartX.current,
    touchStartY: touchStartY.current,
    touchEndX: touchEndX.current,
    touchEndY: touchEndY.current,
  };
};


