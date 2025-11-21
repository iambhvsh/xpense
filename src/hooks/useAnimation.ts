import { useRef, useCallback } from 'react';
import { fadeIn, fadeOut, slideUp, slideDown, scaleIn, runAnimation, DURATION } from '../utils/animations';

/**
 * Hook for managing Web Animations API animations
 * Provides clean interface for common animation patterns
 */
export function useAnimation() {
  const isAnimatingRef = useRef(false);

  const animate = useCallback(async (
    element: HTMLElement | null,
    type: 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown' | 'scaleIn',
    duration?: number
  ): Promise<void> => {
    if (!element || isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    try {
      let animation: Animation;

      switch (type) {
        case 'fadeIn':
          animation = fadeIn(element, duration);
          break;
        case 'fadeOut':
          animation = fadeOut(element, duration);
          break;
        case 'slideUp':
          animation = slideUp(element, duration);
          break;
        case 'slideDown':
          animation = slideDown(element, duration);
          break;
        case 'scaleIn':
          animation = scaleIn(element, duration);
          break;
        default:
          return;
      }

      await runAnimation(animation);
    } finally {
      isAnimatingRef.current = false;
    }
  }, []);

  const animateSequence = useCallback(async (
    animations: Array<{
      element: HTMLElement | null;
      type: 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown' | 'scaleIn';
      duration?: number;
    }>
  ): Promise<void> => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    try {
      for (const anim of animations) {
        if (anim.element) {
          await animate(anim.element, anim.type, anim.duration);
        }
      }
    } finally {
      isAnimatingRef.current = false;
    }
  }, [animate]);

  const animateParallel = useCallback(async (
    animations: Array<{
      element: HTMLElement | null;
      type: 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown' | 'scaleIn';
      duration?: number;
    }>
  ): Promise<void> => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    try {
      const promises = animations
        .filter(anim => anim.element)
        .map(anim => animate(anim.element!, anim.type, anim.duration));

      await Promise.all(promises);
    } finally {
      isAnimatingRef.current = false;
    }
  }, [animate]);

  return {
    animate,
    animateSequence,
    animateParallel,
    isAnimating: isAnimatingRef.current,
    DURATION
  };
}
