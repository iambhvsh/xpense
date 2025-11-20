/**
 * Performance utilities for smooth animations and interactions
 */

/**
 * Debounce function to limit execution rate
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request animation frame wrapper for smooth animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  
  return function throttled(...args: Parameters<T>) {
    if (rafId !== null) return;
    
    rafId = requestAnimationFrame(() => {
      callback(...args);
      rafId = null;
    });
  };
}

/**
 * Batch multiple state updates in a single animation frame
 */
export function batchUpdates(callback: () => void): void {
  requestAnimationFrame(() => {
    callback();
  });
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(element: HTMLElement, offset: number = 0): void {
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get optimal animation duration based on device performance
 */
export function getOptimalAnimationDuration(baseMs: number = 300): number {
  if (prefersReducedMotion()) return 0;
  
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  
  // Reduce duration on low-end devices
  if (cores <= 2 || memory <= 2) {
    return Math.max(baseMs * 0.7, 150);
  }
  
  return baseMs;
}
