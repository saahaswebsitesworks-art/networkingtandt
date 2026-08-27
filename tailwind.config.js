/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        asphalt: {
          DEFAULT: '#0B1F2A',
          light: '#123350',
          soft: '#1B3A4B',
        },
        route: {
          teal: '#0B84C4',
          green: '#2FBF8F',
        },
        amber: {
          DEFAULT: '#FF7A30',
          dark: '#E5601A',
        },
        paper: '#FFFFFF',
        mist: '#EEF6FB',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      backgroundImage: {
        'route-gradient': 'linear-gradient(120deg, #0B84C4 0%, #12A6D6 100%)',
        'asphalt-gradient': 'linear-gradient(160deg, #071620 0%, #0B2C42 55%, #0B4A68 100%)',
      },
      boxShadow: {
        ticket: '0 20px 45px -18px rgba(11,31,42,0.35)',
        lift: '0 34px 70px -28px rgba(11,31,42,0.5)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px -24px rgba(11,132,196,0.55)',
      },
    },
  },
  plugins: [],
};
