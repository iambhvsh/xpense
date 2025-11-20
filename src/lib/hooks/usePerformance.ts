import { useEffect, useRef, useCallback, useMemo, useState } from 'react';

/**
 * Debounce hook - delays execution until after wait time
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * Throttle hook - limits execution to once per wait time
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRun.current = Date.now();
        }, delay - timeSinceLastRun);
      }
    },
    [callback, delay]
  );
}

/**
 * Request Animation Frame hook for smooth animations
 */
export function useRAF(callback: () => void, deps: any[] = []) {
  const rafRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      callback();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, deps);
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Detect low-end device
 */
export function useDevicePerformance() {
  return useMemo(() => {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2;
    
    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Determine performance tier
    const isLowEnd = cores <= 2 || memory <= 2;
    const isMidRange = cores <= 4 && memory <= 4 && !isLowEnd;
    const isHighEnd = !isLowEnd && !isMidRange;

    return {
      cores,
      memory,
      prefersReducedMotion,
      isLowEnd,
      isMidRange,
      isHighEnd,
      // Recommended settings
      shouldReduceAnimations: isLowEnd || prefersReducedMotion,
      shouldLazyLoad: isLowEnd || isMidRange,
      maxListItems: isLowEnd ? 20 : isMidRange ? 50 : 100,
    };
  }, []);
}
