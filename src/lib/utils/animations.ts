/**
 * iOS-style animation utilities using Web Animations API
 * All animations use GPU-accelerated transform and opacity only
 */

// iOS standard easing curve
export const IOS_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Animation durations (in ms)
export const DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  MODAL: 400,
} as const;

/**
 * Fade in animation
 */
export function fadeIn(element: HTMLElement, duration: number = DURATION.NORMAL): Animation {
  return element.animate(
    [
      { opacity: 0 },
      { opacity: 1 }
    ],
    {
      duration,
      easing: IOS_EASING,
      fill: 'forwards'
    }
  );
}

/**
 * Fade out animation
 */
export function fadeOut(element: HTMLElement, duration: number = DURATION.FAST): Animation {
  return element.animate(
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    {
      duration,
      easing: IOS_EASING,
      fill: 'forwards'
    }
  );
}

/**
 * Slide up from bottom (for modals)
 */
export function slideUp(element: HTMLElement, duration: number = DURATION.MODAL): Animation {
  return element.animate(
    [
      { transform: 'translateY(100%)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ],
    {
      duration,
      easing: IOS_EASING,
      fill: 'forwards'
    }
  );
}

/**
 * Slide down to bottom (for modal close)
 */
export function slideDown(element: HTMLElement, duration: number = DURATION.SLOW): Animation {
  return element.animate(
    [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(100%)', opacity: 0 }
    ],
    {
      duration,
      easing: IOS_EASING,
      fill: 'forwards'
    }
  );
}

/**
 * Scale in animation (for alerts)
 */
export function scaleIn(element: HTMLElement, duration: number = DURATION.NORMAL): Animation {
  return element.animate(
    [
      { transform: 'scale(0.94)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 }
    ],
    {
      duration,
      easing: IOS_EASING,
      fill: 'forwards'
    }
  );
}

/**
 * Helper to run animation and return promise
 */
export function runAnimation(animation: Animation): Promise<void> {
  return new Promise((resolve) => {
    animation.onfinish = () => resolve();
  });
}
