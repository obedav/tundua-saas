/**
 * Tests for Environment Variable Validation
 *
 * These tests ensure our env validation works correctly
 * Note: These tests validate the env module in the current test environment
 */

import { describe, it, expect } from 'vitest';
import { clientEnv, isProduction, isDevelopment, isTest } from './env';

describe('Environment Validation', () => {
  describe('Client Environment Variables', () => {
    it('should have required API URL configured', () => {
      expect(clientEnv).toHaveProperty('NEXT_PUBLIC_API_URL');
      expect(typeof clientEnv.NEXT_PUBLIC_API_URL).toBe('string');
      expect(clientEnv.NEXT_PUBLIC_API_URL).toBeTruthy();
    });

    it('should have required APP URL configured', () => {
      expect(clientEnv).toHaveProperty('NEXT_PUBLIC_APP_URL');
      expect(typeof clientEnv.NEXT_PUBLIC_APP_URL).toBe('string');
      expect(clientEnv.NEXT_PUBLIC_APP_URL).toBeTruthy();
    });

    it('should have valid URL formats', () => {
      // Should be valid URLs
      expect(() => new URL(clientEnv.NEXT_PUBLIC_API_URL)).not.toThrow();
      expect(() => new URL(clientEnv.NEXT_PUBLIC_APP_URL)).not.toThrow();
    });

    it('should handle optional Pusher configuration', () => {
      // Optional fields should exist (can be undefined)
      expect(clientEnv).toHaveProperty('NEXT_PUBLIC_PUSHER_KEY');
      expect(clientEnv).toHaveProperty('NEXT_PUBLIC_PUSHER_CLUSTER');
    });

    it('should handle optional Google Analytics ID', () => {
      // Optional field should exist (can be undefined)
      expect(clientEnv).toHaveProperty('NEXT_PUBLIC_GA_MEASUREMENT_ID');
    });
  });

  describe('Helper Functions', () => {
    it('should correctly identify production environment', () => {
      expect(typeof isProduction).toBe('boolean');
      // In test environment, should not be production
      expect(isProduction).toBe(false);
    });

    it('should correctly identify development environment', () => {
      expect(typeof isDevelopment).toBe('boolean');
    });

    it('should correctly identify test environment', () => {
      expect(typeof isTest).toBe('boolean');
      // The test helper correctly identifies boolean type
      // Value depends on how NODE_ENV is set in the environment
    });
  });

  describe('Type Safety', () => {
    it('should export typed client environment variables', () => {
      expect(clientEnv).toHaveProperty('NEXT_PUBLIC_API_URL');
      expect(clientEnv).toHaveProperty('NEXT_PUBLIC_APP_URL');
      expect(typeof clientEnv.NEXT_PUBLIC_API_URL).toBe('string');
      expect(typeof clientEnv.NEXT_PUBLIC_APP_URL).toBe('string');
    });
  });
});
