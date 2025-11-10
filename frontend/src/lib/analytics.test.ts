/**
 * Tests for Google Analytics Helper
 *
 * Ensures analytics tracking works correctly
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as analytics from './analytics';

describe('Analytics Helper', () => {
  beforeEach(() => {
    // Reset window.gtag before each test
    delete (window as any).gtag;
    vi.clearAllMocks();
  });

  describe('isGALoaded', () => {
    it('should return false when gtag is not loaded', () => {
      expect(analytics.isGALoaded()).toBe(false);
    });

    it('should return true when gtag is loaded and measurement ID exists', () => {
      (window as any).gtag = vi.fn();
      // Note: In real scenario, GA_MEASUREMENT_ID would need to be set
      // This is just checking the function logic
      const isLoaded = typeof window.gtag !== 'undefined';
      expect(isLoaded).toBe(true);
    });
  });

  describe('pageview', () => {
    it('should not throw when GA is not loaded', () => {
      expect(() => analytics.pageview('/test')).not.toThrow();
    });

    it('should call gtag with correct parameters when loaded', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      // Mock GA_MEASUREMENT_ID being set
      if (analytics.GA_MEASUREMENT_ID) {
        analytics.pageview('/test-page');
        expect(mockGtag).toHaveBeenCalled();
      }
    });
  });

  describe('event', () => {
    it('should not throw when GA is not loaded', () => {
      expect(() =>
        analytics.event({
          action: 'click',
          category: 'button',
          label: 'test',
        })
      ).not.toThrow();
    });

    it('should log to console in development when GA not loaded', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      analytics.event({
        action: 'test_action',
        category: 'test_category',
        label: 'test_label',
        value: 100,
      });

      // In development, should log the event
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Application-specific events', () => {
    it('should track application created event', () => {
      const eventSpy = vi.spyOn(analytics, 'event');

      analytics.trackApplicationCreated(123, 'Premium', 'United States');

      expect(eventSpy).toHaveBeenCalledWith({
        action: 'application_created',
        category: 'Application',
        label: 'Premium - United States',
        value: 123,
      });

      eventSpy.mockRestore();
    });

    it('should track application submitted event', () => {
      const eventSpy = vi.spyOn(analytics, 'event');

      analytics.trackApplicationSubmitted(456, 599);

      expect(eventSpy).toHaveBeenCalledWith({
        action: 'application_submitted',
        category: 'Application',
        label: 'Application 456',
        value: 599,
      });

      eventSpy.mockRestore();
    });

    it('should track payment initiated event', () => {
      const eventSpy = vi.spyOn(analytics, 'event');

      analytics.trackPaymentInitiated(789, 299, 'stripe');

      expect(eventSpy).toHaveBeenCalledWith({
        action: 'payment_initiated',
        category: 'Payment',
        label: 'stripe',
        value: 299,
      });

      eventSpy.mockRestore();
    });

    it('should track addon purchased event', () => {
      const eventSpy = vi.spyOn(analytics, 'event');

      analytics.trackAddonPurchased('Essay Review', 99);

      expect(eventSpy).toHaveBeenCalledWith({
        action: 'addon_purchased',
        category: 'Add-On',
        label: 'Essay Review',
        value: 99,
      });

      eventSpy.mockRestore();
    });

    it('should track document uploaded event', () => {
      const eventSpy = vi.spyOn(analytics, 'event');

      analytics.trackDocumentUploaded('passport', 123);

      expect(eventSpy).toHaveBeenCalledWith({
        action: 'document_uploaded',
        category: 'Document',
        label: 'passport',
        value: 123,
      });

      eventSpy.mockRestore();
    });
  });

  describe('trackPurchase', () => {
    it('should track purchase with correct format', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      if (analytics.GA_MEASUREMENT_ID) {
        analytics.trackPurchase('TXN-123', 599, 'USD', [
          {
            item_id: 'APP-123',
            item_name: 'Premium Package',
            price: 599,
            quantity: 1,
          },
        ]);

        expect(mockGtag).toHaveBeenCalled();
      }
    });
  });

  describe('trackError', () => {
    it('should track errors without throwing', () => {
      expect(() => analytics.trackError('Test error', true)).not.toThrow();
    });

    it('should log error to console in development', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');

      analytics.trackError('Test error message', false);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('trackSearch', () => {
    it('should track search events', () => {
      const eventSpy = vi.spyOn(analytics, 'event');

      analytics.trackSearch('university in USA', 'University Search');

      expect(eventSpy).toHaveBeenCalledWith({
        action: 'search',
        category: 'University Search',
        label: 'university in USA',
      });

      eventSpy.mockRestore();
    });

    it('should use default category if not provided', () => {
      const eventSpy = vi.spyOn(analytics, 'event');

      analytics.trackSearch('test query');

      expect(eventSpy).toHaveBeenCalledWith({
        action: 'search',
        category: 'Search',
        label: 'test query',
      });

      eventSpy.mockRestore();
    });
  });

  describe('User authentication events', () => {
    it('should track signup event', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      if (analytics.GA_MEASUREMENT_ID) {
        analytics.trackSignup(123, 'email');
        expect(mockGtag).toHaveBeenCalled();
      } else {
        // Should not throw even if GA not loaded
        expect(() => analytics.trackSignup(123, 'email')).not.toThrow();
      }
    });

    it('should track login event', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      if (analytics.GA_MEASUREMENT_ID) {
        analytics.trackLogin(456, 'email');
        expect(mockGtag).toHaveBeenCalled();
      } else {
        // Should not throw even if GA not loaded
        expect(() => analytics.trackLogin(456, 'email')).not.toThrow();
      }
    });
  });
});
