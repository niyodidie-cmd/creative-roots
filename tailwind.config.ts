import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#050816',
        gold: '#C69B6D',
        sand: '#F8F0E3',
        story: '#27233A'
      },
      boxShadow: {
        cinematic: '0 24px 60px rgba(4, 12, 34, 0.25)'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(5,8,22,0.88), rgba(5,8,22,0.98))'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
