const nextConfig = require('eslint-config-next');
const prettier = require('eslint-config-prettier');

module.exports = [
  ...nextConfig,
  prettier,
  {
    settings: {
      react: { version: '19' },
    },
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];
