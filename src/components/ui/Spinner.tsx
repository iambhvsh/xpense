import React from 'react';

interface SpinnerProps {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className = 'w-6 h-6' }) => (
  <svg 
    className={className}
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
    style={{ 
      animation: 'ios-spin 0.8s steps(12) infinite',
      willChange: 'transform'
    }}
  >
    <style>
      {`
        @keyframes ios-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
    <g fill="currentColor">
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="1" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.92" transform="rotate(30 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.83" transform="rotate(60 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.75" transform="rotate(90 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.67" transform="rotate(120 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.58" transform="rotate(150 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.5" transform="rotate(180 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.42" transform="rotate(210 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.33" transform="rotate(240 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.25" transform="rotate(270 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.17" transform="rotate(300 25 25)" />
      <rect x="23" y="2" width="4" height="12" rx="2" opacity="0.08" transform="rotate(330 25 25)" />
    </g>
  </svg>
);
