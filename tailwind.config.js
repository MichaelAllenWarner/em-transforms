// @ts-check
const plugin = require('tailwindcss/plugin');
const withAlphaVariable =
  require('tailwindcss/lib/util/withAlphaVariable').default;
const flattenColorPalette =
  require('tailwindcss/lib/util/flattenColorPalette').default;

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
      '2xl': em(1536),
    },
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(:root[data-theme="light"] *) }',
      '&:is(:root[data-theme="dark"] *)',
    ],
  ],
  variants: {
    extend: {},
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'text-fill': (value) => {
            return withAlphaVariable({
              color: value,
              property: '-webkit-text-fill-color',
              variable: '--tw-text-opacity',
            });
          },
        },
        {
          values: flattenColorPalette(theme('textColor')),
          type: ['color', 'any'],
        },
      );
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
