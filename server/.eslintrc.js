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
  rules: {},
  overrides: [
    {
      files: ['**/*.js', '**/*.js'],
      excludedFiles: 'node_modules/*.*',
    },
  ],
};
