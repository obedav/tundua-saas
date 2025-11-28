import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest Configuration for Next.js 14
 *
 * Vitest is a modern, fast testing framework built on Vite
 * Perfect replacement for Jest with better performance
 */
export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom', // Simulates browser environment

    // Setup files to run before each test file
    setupFiles: ['./src/tests/setup.tsx'],

    // Global test utilities (automatically available in all tests)
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8', // Fast native coverage
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.tsx',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
      ],
      exclude: [
        'node_modules/',
        'src/tests/',
        '.next/',
        'coverage/',
        '**/*.config.{js,ts}',
        '**/types/**',
      ],
      // Coverage thresholds (fail if below these)
      thresholds: {
        lines: 60,      // Start at 60%, increase gradually
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },

    // Include/exclude patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist'],

    // Test timeout (10 seconds)
    testTimeout: 10000,

    // Reporters
    reporters: ['verbose'], // Show detailed test results

    // Mock CSS modules and other assets
    css: false, // Don't process CSS

    // Watch mode settings (for development)
    watch: false, // Don't watch by default (enable with --watch flag)
  },

  // Path resolution (match Next.js tsconfig)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
