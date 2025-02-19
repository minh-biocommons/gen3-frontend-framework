module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['jsx-a11y', 'react', 'react-hooks', '@typescript-eslint'],
  rules: {
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'linebreak-style': ['error', 'unix'],
    quotes: ['warn', 'single'],
    'jsx-quotes': ['warn', 'prefer-double'],
    semi: ['error', 'always'],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'react/jsx-fragments': ['warn', 'element'],
    // disable these because we're using React 17+ with the jsx transform
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
    next: {
      rootDir: 'packages/sampleCommons',
    },
  },
};
