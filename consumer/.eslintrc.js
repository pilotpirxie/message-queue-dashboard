module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-continue': 'off',
    'no-await-in-loop': 'off',
    'no-constant-condition': 'off',
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.js'],
      excludedFiles: 'node_modules/*.*',
    },
  ],
};
