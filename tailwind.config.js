/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ios-blue': '#007AFF',
        'ios-green': '#34C759',
        'ios-red': '#FF3B30',
        'ios-orange': '#FF9500',
        'ios-yellow': '#FFCC00',
        'ios-purple': '#AF52DE',
        'ios-pink': '#FF2D55',
        'ios-teal': '#5AC8FA',
        'ios-indigo': '#5856D6',
        'ios-gray': '#8E8E93',
        'ios-gray-2': '#AEAEB2',
        'ios-gray-3': '#C7C7CC',
        'ios-gray-4': '#D1D1D6',
        'ios-gray-5': '#E5E5EA',
        'ios-gray-6': '#F2F2F7',
        'ios-background': '#F2F2F7',
        'ios-background-secondary': '#FFFFFF',
        'ios-label': '#000000',
        'ios-label-secondary': '#3C3C43',
        'ios-label-tertiary': '#3C3C4399',
        'ios-separator': '#3C3C4349',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'ios-large-title': ['34px', { lineHeight: '41px', fontWeight: '700', letterSpacing: '0.37px' }],
        'ios-title-1': ['28px', { lineHeight: '34px', fontWeight: '700', letterSpacing: '0.36px' }],
        'ios-title-2': ['22px', { lineHeight: '28px', fontWeight: '700', letterSpacing: '0.35px' }],
        'ios-title-3': ['20px', { lineHeight: '25px', fontWeight: '600', letterSpacing: '0.38px' }],
        'ios-headline': ['17px', { lineHeight: '22px', fontWeight: '600', letterSpacing: '-0.41px' }],
        'ios-body': ['17px', { lineHeight: '22px', fontWeight: '400', letterSpacing: '-0.41px' }],
        'ios-callout': ['16px', { lineHeight: '21px', fontWeight: '400', letterSpacing: '-0.32px' }],
        'ios-subheadline': ['15px', { lineHeight: '20px', fontWeight: '400', letterSpacing: '-0.24px' }],
        'ios-footnote': ['13px', { lineHeight: '18px', fontWeight: '400', letterSpacing: '-0.08px' }],
        'ios-caption-1': ['12px', { lineHeight: '16px', fontWeight: '400', letterSpacing: '0px' }],
        'ios-caption-2': ['11px', { lineHeight: '13px', fontWeight: '400', letterSpacing: '0.06px' }],
      },
      borderRadius: {
        'ios-small': '10px',
        'ios-medium': '12px',
        'ios-large': '14px',
        'ios-xlarge': '20px',
      },
      boxShadow: {
        'ios-1': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'ios-2': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'ios-3': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'ios-4': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'fade-out': 'fadeOut 0.15s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        'scale-out': 'scaleOut 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.92)', opacity: '0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}
