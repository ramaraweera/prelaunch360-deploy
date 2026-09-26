import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0A7E8C',
          50: '#E6F4F5',
          100: '#CCE9EB',
          200: '#99D3D7',
          300: '#66BDC3',
          400: '#33A7AF',
          500: '#0A7E8C',
          600: '#086570',
          700: '#064C54',
          800: '#043238',
          900: '#02191C',
        },
        coral: {
          DEFAULT: '#F27059',
          50: '#FEF2F0',
          100: '#FDE5E1',
          200: '#FBCBC3',
          300: '#F9B1A5',
          400: '#F79787',
          500: '#F27059',
          600: '#EF4A2E',
          700: '#D93211',
          800: '#A3260D',
          900: '#6D1908',
        },
        sage: {
          DEFAULT: '#A8C5AA',
          50: '#F4F8F4',
          100: '#E9F1EA',
          200: '#D3E3D5',
          300: '#BDD5BF',
          400: '#A8C5AA',
          500: '#8BB58D',
          600: '#6FA471',
          700: '#568658',
          800: '#3E6140',
          900: '#263C27',
        },
        neutral: {
          dark: '#2D3436',
          light: '#FAF5F0',
        },
        amber: {
          accent: '#F0B775',
        },
        success: '#4CAF50',
        error: '#F44336',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
