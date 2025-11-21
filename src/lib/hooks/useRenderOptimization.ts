import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for intersection observer with optimized callbacks
 */
export const useIntersectionObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) => {
  const targetRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    if (!targetRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          requestAnimationFrame(() => callback(entry));
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observerRef.current.observe(targetRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return targetRef;
};
