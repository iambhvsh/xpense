/**
 * Memory Leak Detection and Cleanup
 * Prevents zombied animations, event listeners, and component leaks
 */

// Track active event listeners for cleanup
const activeListeners = new Map<string, { element: EventTarget; event: string; handler: EventListener }>();

/**
 * Add tracked event listener (auto-cleanup on unmount)
 */
export function addTrackedListener(
  id: string,
  element: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler, options);
  activeListeners.set(id, { element, event, handler });
  
  // Return cleanup function
  return () => {
    element.removeEventListener(event, handler);
    activeListeners.delete(id);
  };
}

/**
 * Remove tracked listener
 */
export function removeTrackedListener(id: string): void {
  const listener = activeListeners.get(id);
  if (listener) {
    listener.element.removeEventListener(listener.event, listener.handler);
    activeListeners.delete(id);
  }
}

/**
 * Cleanup all tracked listeners (use on app unmount)
 */
export function cleanupAllListeners(): void {
  activeListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler);
  });
  activeListeners.clear();
}

// Track active intervals/timeouts
const activeTimers = new Map<string, number>();

/**
 * Set tracked interval (auto-cleanup)
 */
export function setTrackedInterval(id: string, callback: () => void, ms: number): () => void {
  const timerId = window.setInterval(callback, ms);
  activeTimers.set(id, timerId);
  
  return () => {
    window.clearInterval(timerId);
    activeTimers.delete(id);
  };
}

/**
 * Set tracked timeout (auto-cleanup)
 */
export function setTrackedTimeout(id: string, callback: () => void, ms: number): () => void {
  const timerId = window.setTimeout(callback, ms);
  activeTimers.set(id, timerId);
  
  return () => {
    window.clearTimeout(timerId);
    activeTimers.delete(id);
  };
}

/**
 * Clear tracked timer
 */
export function clearTrackedTimer(id: string): void {
  const timerId = activeTimers.get(id);
  if (timerId !== undefined) {
    window.clearInterval(timerId);
    window.clearTimeout(timerId);
    activeTimers.delete(id);
  }
}

/**
 * Cleanup all timers
 */
export function cleanupAllTimers(): void {
  activeTimers.forEach((timerId) => {
    window.clearInterval(timerId);
    window.clearTimeout(timerId);
  });
  activeTimers.clear();
}

// Track active animations
const activeAnimations = new Map<string, Animation>();

/**
 * Track animation for cleanup
 */
export function trackAnimation(id: string, animation: Animation): () => void {
  activeAnimations.set(id, animation);
  
  // Auto-remove when finished
  animation.onfinish = () => {
    activeAnimations.delete(id);
  };
  
  return () => {
    animation.cancel();
    activeAnimations.delete(id);
  };
}

/**
 * Cancel tracked animation
 */
export function cancelTrackedAnimation(id: string): void {
  const animation = activeAnimations.get(id);
  if (animation) {
    animation.cancel();
    activeAnimations.delete(id);
  }
}

/**
 * Cleanup all animations
 */
export function cleanupAllAnimations(): void {
  activeAnimations.forEach((animation) => {
    animation.cancel();
  });
  activeAnimations.clear();
}

/**
 * Full cleanup (call on app unmount)
 */
export function cleanupAll(): void {
  cleanupAllListeners();
  cleanupAllTimers();
  cleanupAllAnimations();
}

/**
 * Get memory usage stats (if available)
 */
export function getMemoryStats(): { used: number; limit: number } | null {
  if ('memory' in performance && (performance as any).memory) {
    const mem = (performance as any).memory;
    return {
      used: Math.round(mem.usedJSHeapSize / 1024 / 1024), // MB
      limit: Math.round(mem.jsHeapSizeLimit / 1024 / 1024) // MB
    };
  }
  return null;
}

/**
 * Log memory stats (development only)
 */
export function logMemoryStats(): void {
  const stats = getMemoryStats();
  if (stats) {
    console.log(`Memory: ${stats.used}MB / ${stats.limit}MB (${((stats.used / stats.limit) * 100).toFixed(1)}%)`);
  }
}
