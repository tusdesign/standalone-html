module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    "plugin:import/recommended",
  ],
  rules: {
    'import/prefer-default-export': 0,
    'max-len': 0,
    "react/jsx-filename-extension": "off"
  }
};
