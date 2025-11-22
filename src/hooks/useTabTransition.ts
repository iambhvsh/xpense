/**
 * Custom hook for smooth tab transitions using Web Animations API
 * Provides Apple-like smooth transitions with hardware acceleration
 */

import { useEffect, useRef } from 'react';

const TRANSITION_DURATION = 350;
const EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Apple's easing

export const useTabTransition = (isActive: boolean) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated.current) return;

    // Only animate on mount if active
    if (isActive) {
      requestAnimationFrame(() => {
        element.animate(
          [
            {
              opacity: 0,
              transform: 'translateY(8px) scale(0.98)',
            },
            {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            },
          ],
          {
            duration: TRANSITION_DURATION,
            easing: EASING,
            fill: 'forwards',
          }
        );
      });

      hasAnimated.current = true;
    }
  }, [isActive]);

  return elementRef;
};
