import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
    { ignores: ['dist', 'coverage', '*.json', '.releaserc.json', 'package.json', 'package-lock.json', 'simulation-engine/**'] },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: { react: { version: '18.3' } },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react/jsx-no-target-blank': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'react/prop-types': 'off', // Disable prop-types as we're moving to TS or ignored
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'react/no-unescaped-entities': 'warn', // Downgrade to warning
            'react/display-name': 'warn', // Downgrade to warning
        },
    },
    {
        files: ['**/*.test.{js,jsx}', 'tests/**'],
        languageOptions: {
            globals: globals.jest,
        },
    },
    {
        files: ['vite.config.js', 'postcss.config.js', 'tailwind.config.js', 'jest.config.js', 'commitlint.config.js'],
        languageOptions: {
            globals: globals.node,
        },
    },
];
