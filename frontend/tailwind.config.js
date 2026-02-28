/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'warm-brown': '#8B5E3C',
        'soft-gold': '#D4A373',
        'cream': '#FDF6EC',
        'dark-charcoal': '#2C2C2C',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-in': 'slideIn 0.6s ease-out',
        'glow-hover': 'glowHover 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowHover: {
          '0%': { boxShadow: '0 4px 15px rgba(139, 94, 60, 0.3)' },
          '100%': { boxShadow: '0 6px 20px rgba(139, 94, 60, 0.4)' },
        },
      },
      spacing: {
        'nav-height': '70px',
      },
    },
  },
  plugins: [],
};
