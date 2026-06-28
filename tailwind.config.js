/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html'],
  theme: {
    extend: {
      colors: {
        // Warm sage / garden green — friendly, agricultural, Kansas-prairie feel
        brand: {
          50: '#f4f7ef',
          100: '#e6efd9',
          200: '#cddfb4',
          300: '#abc886',
          400: '#86ab5b',
          500: '#678c3e',
          600: '#507030',
          700: '#3f5a2a',
          800: '#354a27',
          900: '#2d3e23',
          950: '#16210f',
        },
        // Warm stone neutral — pairs with sage without going muddy
        ink: {
          50: '#f8f8f4',
          100: '#ecece4',
          200: '#dadacd',
          300: '#bdbdaa',
          400: '#999985',
          500: '#7a7a68',
          600: '#616153',
          700: '#4d4d43',
          800: '#34342e',
          900: '#23231f',
          950: '#151512',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 12px 32px -14px rgba(53, 74, 39, 0.35)',
        card: '0 4px 22px -6px rgba(35, 35, 31, 0.12)',
        'card-hover': '0 14px 34px -12px rgba(35, 35, 31, 0.18)',
      },
      backgroundImage: {
        'hero-mesh':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(171, 200, 134, 0.22), transparent), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(80, 112, 48, 0.12), transparent), radial-gradient(ellipse 40% 35% at 10% 60%, rgba(103, 140, 62, 0.1), transparent)',
        'grid-pattern':
          'linear-gradient(rgba(35, 35, 31, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(35, 35, 31, 0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
    },
  },
  plugins: [],
};
