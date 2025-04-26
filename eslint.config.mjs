import { FlatCompat } from '@eslint/eslintrc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    }
  }
];

export default eslintConfig;
