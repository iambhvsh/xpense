import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for optimized scrolling with momentum and smooth behavior
 * Implements Apple-style scroll physics
 */
export const useOptimizedScroll = (enabled: boolean = true) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const lastScrollTop = useRef(0);
  const velocityRef = useRef(0);

  const smoothScroll = useCallback((targetY: number, duration: number = 300) => {
    if (!scrollRef.current) return;

    const startY = scrollRef.current.scrollTop;
    const distance = targetY - startY;
    const startTime = performance.now();

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      if (scrollRef.current) {
        scrollRef.current.scrollTop = startY + distance * eased;
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!enabled || !scrollRef.current) return;

    const element = scrollRef.current;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollTop = element.scrollTop;
          velocityRef.current = currentScrollTop - lastScrollTop.current;
          lastScrollTop.current = currentScrollTop;
          ticking = false;
        });
        ticking = true;
      }
    };

    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled]);

  const scrollToTop = useCallback((smooth: boolean = true) => {
    if (smooth) {
      smoothScroll(0);
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [smoothScroll]);

  const scrollToBottom = useCallback((smooth: boolean = true) => {
    if (!scrollRef.current) return;
    const target = scrollRef.current.scrollHeight;
    if (smooth) {
      smoothScroll(target);
    } else {
      scrollRef.current.scrollTop = target;
    }
  }, [smoothScroll]);

  return {
    scrollRef,
    scrollToTop,
    scrollToBottom,
    smoothScroll,
    velocity: velocityRef.current
  };
};
