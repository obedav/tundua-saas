/**
 * Tests for Test Utilities
 *
 * Ensures our test helpers work correctly
 */

import { describe, it, expect } from 'vitest';
import {
  createMockUser,
  createMockApplication,
  createMockNotification,
  createMockApiResponse,
  createMockApiError,
  delay,
} from './test-utils';

describe('Test Utilities', () => {
  describe('createMockUser', () => {
    it('should create a valid user object with defaults', () => {
      const user = createMockUser();

      expect(user).toMatchObject({
        id: expect.any(Number),
        uuid: expect.any(String),
        email: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        role: expect.stringMatching(/^(user|admin|super_admin)$/),
        email_verified: expect.any(Boolean),
        is_active: expect.any(Boolean),
      });
    });

    it('should accept override properties', () => {
      const user = createMockUser({
        email: 'custom@example.com',
        role: 'admin',
      });

      expect(user.email).toBe('custom@example.com');
      expect(user.role).toBe('admin');
    });

    it('should maintain default values for non-overridden properties', () => {
      const user = createMockUser({
        email: 'override@example.com',
      });

      expect(user.email).toBe('override@example.com');
      expect(user.first_name).toBe('Test'); // Default value
      expect(user.email_verified).toBe(true); // Default value
    });
  });

  describe('createMockApplication', () => {
    it('should create a valid application object', () => {
      const application = createMockApplication();

      expect(application).toMatchObject({
        id: expect.any(Number),
        reference_number: expect.stringMatching(/^TUND-/),
        destination_country: expect.any(String),
        service_tier_name: expect.any(String),
        status: expect.stringMatching(/^(draft|submitted|under_review|approved|rejected)$/),
        total_amount: expect.any(String),
      });
    });

    it('should accept override properties', () => {
      const application = createMockApplication({
        status: 'approved',
        destination_country: 'Canada',
      });

      expect(application.status).toBe('approved');
      expect(application.destination_country).toBe('Canada');
    });
  });

  describe('createMockNotification', () => {
    it('should create a valid notification object', () => {
      const notification = createMockNotification();

      expect(notification).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        message: expect.any(String),
        type: expect.stringMatching(/^(info|success|warning|error)$/),
        is_read: expect.any(Boolean),
      });
    });

    it('should accept override properties', () => {
      const notification = createMockNotification({
        type: 'error',
        is_read: true,
        title: 'Custom Title',
      });

      expect(notification?.type).toBe('error');
      expect(notification.is_read).toBe(true);
      expect(notification?.title).toBe('Custom Title');
    });
  });

  describe('createMockApiResponse', () => {
    it('should create a successful API response', () => {
      const data = { id: 1, name: 'Test' };
      const response = createMockApiResponse(data);

      expect(response.data.success).toBe(true);
      expect(response.data.data).toEqual(data);
      expect(response.status).toBe(200);
    });

    it('should create an error API response', () => {
      const data = { id: 1, name: 'Test' };
      const response = createMockApiResponse(data, false);

      expect(response.data.success).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should include correct status text', () => {
      const successResponse = createMockApiResponse({}, true);
      expect(successResponse.statusText).toBe('OK');

      const errorResponse = createMockApiResponse({}, false);
      expect(errorResponse.statusText).toBe('Bad Request');
    });
  });

  describe('createMockApiError', () => {
    it('should create an API error object', () => {
      const error = createMockApiError('Test error');

      expect(error.response.data.success).toBe(false);
      expect(error.response.data.error).toBe('Test error');
      expect(error.message).toBe('Test error');
    });

    it('should accept custom status code', () => {
      const error = createMockApiError('Not found', 404);

      expect(error.response.status).toBe(404);
    });

    it('should default to 500 status code', () => {
      const error = createMockApiError();

      expect(error.response.status).toBe(500);
    });
  });

  describe('delay', () => {
    it('should wait for specified milliseconds', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();

      // Allow some tolerance for timing
      expect(end - start).toBeGreaterThanOrEqual(90);
      expect(end - start).toBeLessThan(200);
    });

    it('should resolve without value', async () => {
      const result = await delay(10);
      expect(result).toBeUndefined();
    });
  });

  describe('Type Safety', () => {
    it('should maintain type safety for mock objects', () => {
      const user = createMockUser();
      const application = createMockApplication();
      const notification = createMockNotification();

      // TypeScript should allow accessing these properties
      expect(user.email).toBeDefined();
      expect(application.reference_number).toBeDefined();
      expect(notification?.title).toBeDefined();

      // TypeScript should infer correct types
      const userId: number = user.id;
      const appStatus: string = application.status;
      const notifRead: boolean = notification.is_read;

      expect(typeof userId).toBe('number');
      expect(typeof appStatus).toBe('string');
      expect(typeof notifRead).toBe('boolean');
    });
  });
});
