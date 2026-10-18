module.exports = {
  root: true,

  env: {
    browser: true,
    es2021: true,
  },

  settings: {
    react: {
      version: "detect",
    },
  },

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: ["react-refresh"],

  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/prop-types": "off",

    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",

    "react-refresh/only-export-components": [
      "error",
      { allowConstantExport: true },
    ],
  },
};
