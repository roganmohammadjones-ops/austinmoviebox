/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Dark Cinematic canonical tokens
        'background-root': '#08090D',
        'background-secondary': '#111318',
        'surface-card': '#141923',
        'surface-elevated': '#202736',
        'accent-primary': '#E50914',
        'accent-secondary': '#F5C518',
        'cinema-red': '#E50914',
        'rating-gold': '#F5C518',
        'text-primary': '#FFFFFF',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
        'border-default': '#202736',
        'border-highlight': '#2D3748',
        divider: 'rgba(255, 255, 255, 0.08)',

        // Feedback
        success: '#36C98F',
        warning: '#F7B955',
        error: '#FF5C68',

        // Backward compatibility
        'cinema-canvas': '#08090D',
        'raised-stage': '#141923',
        'quiet-stage': '#202736',
        'frame-border': '#2D3748',
        'primary-ink': '#FFFFFF',
        'secondary-ink': '#9CA3AF',
        'muted-ink': '#6B7280',
        'cinema-amber': '#F5C518',
        'surface-container-lowest': '#08090D',
        'surface-container-low': '#111318',
        'surface-container': '#141923',
        'surface-container-high': '#202736',
        'surface-container-highest': '#292A2C',
        'surface-bright': '#38393B',
        'on-surface': '#FFFFFF',
        'on-surface-variant': '#9CA3AF',
        canvas: '#08090D',
        surface: '#141923',
        elevated: '#202736',
        brand: '#E50914',
      },
      borderRadius: {
        button: '12px',
        input: '14px',
        card: '16px',
        surface: '20px',
        sheet: '24px',
      },
      aspectRatio: {
        'poster': '2 / 3',
        'backdrop': '16 / 9',
      },
    },
  },
  plugins: [],
};
