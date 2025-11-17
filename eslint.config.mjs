// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        extends: [...tseslint.configs.recommended],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ...react.configs.flat.recommended,
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ...react.configs.flat['jsx-runtime'],
    },
    {
        plugins: { prettier },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                },
            ],
        },
    }
);
