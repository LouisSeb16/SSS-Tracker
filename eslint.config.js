// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// Architecture rules from docs/SPEC.md section 5.2, enforced as lint errors.
// ESLint replaces (not merges) a rule's options per file, so every layer block
// below repeats the shared bans via `ban()`.
const DRIZZLE = {
  group: ['drizzle-orm', 'drizzle-orm/*', 'drizzle-kit', 'expo-sqlite'],
  message: 'Only repositories (and core/db) may import Drizzle or expo-sqlite.',
};

const layer = (name) => [`@/features/*/${name}/**`, `**/features/*/${name}/**`];

const ban = (...extra) => ({
  'no-restricted-imports': ['error', { patterns: [DRIZZLE, ...extra] }],
});

const noDb = {
  group: ['@/core/db', '@/core/db/**'],
  message: 'Only repositories may import the db.',
};

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*', '.expo/*', 'drizzle/*'] },

  // Default: nobody but repositories and core/db touches Drizzle.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/features/*/repositories/**', 'src/core/db/**'],
    rules: ban(),
  },
  // Components: props in, JSX out. No data access, no container hooks.
  {
    files: ['src/features/*/components/**/*.{ts,tsx}', 'src/shared/components/**/*.{ts,tsx}'],
    rules: ban(noDb, {
      group: [
        ...layer('queries'),
        ...layer('services'),
        ...layer('repositories'),
        ...layer('hooks'),
      ],
      message:
        'Components are presentational: no queries, services, repositories or container hooks.',
    }),
  },
  // Screens: compose container hooks and components only.
  {
    files: ['src/features/*/screens/**/*.{ts,tsx}'],
    rules: ban(noDb, {
      group: [...layer('queries'), ...layer('services'), ...layer('repositories')],
      message: 'Screens call container hooks, not queries, services or repositories.',
    }),
  },
  // Hooks and queries: no repositories or db.
  {
    files: ['src/features/*/hooks/**/*.{ts,tsx}', 'src/features/*/queries/**/*.{ts,tsx}'],
    rules: ban(noDb, {
      group: layer('repositories'),
      message: 'Hooks and queries go through services, never repositories.',
    }),
  },
  // Services: plain TypeScript, no React.
  {
    files: ['src/features/*/services/**/*.{ts,tsx}'],
    rules: ban({
      group: ['react', 'react-native', 'react-native/*', '@tanstack/*', 'zustand', 'zustand/*'],
      message: 'Services are React-free so they are easy to unit test.',
    }),
  },
]);
