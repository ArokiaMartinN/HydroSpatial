/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === LIGHT BLUE + VIOLET PALETTE ===
        'indigo': { DEFAULT: '#6366f1', hover: '#4f46e5', light: '#e0e7ff' },
        'violet': { DEFAULT: '#8b5cf6', hover: '#7c3aed', light: '#ede9fe' },
        'sky': { DEFAULT: '#38bdf8', light: '#e0f2fe' },
        'brand': '#6366f1',
        'bg-main': '#f0f4ff',
        'bg-card': '#ffffff',
        'text-brand': '#1e1b4b',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'gradient-violet': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
        'gradient-soft': 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)',
      },
      boxShadow: {
        'violet': '0 8px 25px -5px rgba(139, 92, 246, 0.35)',
        'sky': '0 8px 25px -5px rgba(56, 189, 248, 0.25)',
        'indigo': '0 8px 25px -5px rgba(99, 102, 241, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { 'from': { backgroundPosition: '-200% 0' }, 'to': { backgroundPosition: '200% 0' } },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
