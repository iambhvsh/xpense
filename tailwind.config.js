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
      },
    },
  },
  plugins: [],
}
