/** @param {number} num */
const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');

/** @param {number} px */
const em = (px, base = 16) => `${round(px / base)}em`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './helpers/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      /* Tailwind defaults, but in `em` (see https://danburzo.ro/media-query-units/) */
      sm: em(640),
      md: em(768),
      lg: em(1024),
      xl: em(1280),
      // I prefer to stop at `xl`
      // '2xl': em(1536)
    },
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
