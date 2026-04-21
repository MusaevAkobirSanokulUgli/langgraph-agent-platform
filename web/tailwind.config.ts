import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#0C0A1D',
          900: '#0F0C24',
          800: '#14112E',
          700: '#1A1638',
        },
        indigo: {
          950: '#1E1B4B',
          900: '#312E81',
          800: '#3730A3',
          700: '#4338CA',
          600: '#4F46E5',
          500: '#6366F1',
          400: '#818CF8',
          300: '#A5B4FC',
          200: '#C7D2FE',
          100: '#E0E7FF',
        },
        violet: {
          950: '#2E1065',
          900: '#4C1D95',
          800: '#5B21B6',
          700: '#6D28D9',
          600: '#7C3AED',
          500: '#8B5CF6',
          400: '#A78BFA',
          300: '#C4B5FD',
          200: '#DDD6FE',
          100: '#EDE9FE',
        },
        purple: {
          950: '#3B0764',
          900: '#581C87',
          800: '#6B21A8',
          700: '#7E22CE',
          600: '#9333EA',
          500: '#A855F7',
          400: '#C084FC',
          300: '#D8B4FE',
          200: '#E9D5FF',
          100: '#F3E8FF',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'void-gradient': 'linear-gradient(135deg, #0C0A1D 0%, #14112E 50%, #0C0A1D 100%)',
        'violet-glow': 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'purple-glow': 'radial-gradient(ellipse at center, rgba(192,132,252,0.12) 0%, transparent 70%)',
        'node-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-violet': 'pulseViolet 2.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'flow': 'flow 2s linear infinite',
        'flow-violet': 'flowViolet 1.8s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'typing': 'typing 1.5s steps(20, end) infinite',
        'blink': 'blink 1s step-end infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        flow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        flowViolet: {
          to: { strokeDashoffset: '-32' },
        },
        pulseViolet: {
          '0%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.5)' },
          '70%': { boxShadow: '0 0 0 14px rgba(139, 92, 246, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
      boxShadow: {
        'violet-sm': '0 0 10px rgba(139, 92, 246, 0.3)',
        'violet': '0 0 20px rgba(139, 92, 246, 0.4)',
        'violet-lg': '0 0 40px rgba(139, 92, 246, 0.3)',
        'violet-xl': '0 0 60px rgba(139, 92, 246, 0.4)',
        'purple-sm': '0 0 10px rgba(192, 132, 252, 0.3)',
        'purple': '0 0 20px rgba(192, 132, 252, 0.35)',
        'node-glow': '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
