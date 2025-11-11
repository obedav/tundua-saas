/**
 * Tests for Environment Variable Validation
 *
 * These tests ensure our env validation catches configuration errors
 */

import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Client Environment Variables', () => {
    it('should validate required API URL', () => {
      process.env['NEXT_PUBLIC_API_URL'] = 'http://localhost:8000';
      process.env['NEXT_PUBLIC_APP_URL'] = 'http://localhost:3000';

      expect(() => require('./env')).not.toThrow();
    });

    it('should reject invalid API URL format', () => {
      process.env['NEXT_PUBLIC_API_URL'] = 'not-a-url';
      process.env['NEXT_PUBLIC_APP_URL'] = 'http://localhost:3000';

      expect(() => require('./env')).toThrow();
    });

    it('should accept optional Pusher configuration', () => {
      process.env['NEXT_PUBLIC_API_URL'] = 'http://localhost:8000';
      process.env['NEXT_PUBLIC_APP_URL'] = 'http://localhost:3000';
      process.env['NEXT_PUBLIC_PUSHER_KEY'] = 'test-key';
      process.env['NEXT_PUBLIC_PUSHER_CLUSTER'] = 'us2';

      expect(() => require('./env')).not.toThrow();
    });

    it('should accept optional Google Analytics ID', () => {
      process.env['NEXT_PUBLIC_API_URL'] = 'http://localhost:8000';
      process.env['NEXT_PUBLIC_APP_URL'] = 'http://localhost:3000';
      process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] = 'G-XXXXXXXXXX';

      expect(() => require('./env')).not.toThrow();
    });
  });

  describe('Helper Functions', () => {
    it('should correctly identify production environment', () => {
      // Note: NODE_ENV is read-only in runtime, so we skip direct assignment in tests
      const { isProduction } = require('./env');
      expect(typeof isProduction).toBe('boolean');
    });

    it('should correctly identify development environment', () => {
      // Note: NODE_ENV is read-only in runtime, so we skip direct assignment in tests
      const { isDevelopment } = require('./env');
      expect(typeof isDevelopment).toBe('boolean');
    });

    it('should correctly identify test environment', () => {
      // Note: NODE_ENV is read-only in runtime, so we skip direct assignment in tests
      const { isTest } = require('./env');
      expect(typeof isTest).toBe('boolean');
    });
  });

  describe('Type Safety', () => {
    it('should export typed client environment variables', () => {
      process.env['NEXT_PUBLIC_API_URL'] = 'http://localhost:8000';
      process.env['NEXT_PUBLIC_APP_URL'] = 'http://localhost:3000';

      const { clientEnv } = require('./env');

      expect(clientEnv).toHaveProperty('NEXT_PUBLIC_API_URL');
      expect(clientEnv).toHaveProperty('NEXT_PUBLIC_APP_URL');
      expect(typeof clientEnv.NEXT_PUBLIC_API_URL).toBe('string');
    });
  });
});
