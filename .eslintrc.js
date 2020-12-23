module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    'no-console': 'error',
    semi: ['error', 'never'],
    // '@typescript-eslint/semi': ['error', 'never'],
  },
  overrides: [
    {
      files: ['*.test.*', '**/__tests__/**'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
