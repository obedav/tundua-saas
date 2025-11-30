// Google Analytics 4 tracking utility
import { clientEnv } from '@/lib/env';

export const GA_MEASUREMENT_ID = clientEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Types for GA events
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string | number;
}

// Check if GA is loaded
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag !== 'undefined' && !!GA_MEASUREMENT_ID;
};

// Page view tracking
export const pageview = (url: string) => {
  if (!isGALoaded()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Event tracking
export const event = ({ action, category, label, value, userId }: GAEvent) => {
  if (!isGALoaded()) {
    console.log('[Analytics - Dev]', { action, category, label, value, userId });
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    user_id: userId,
  });
};

// E-commerce tracking
export const trackPurchase = (transactionId: string, value: number, currency: string, items: any[]) => {
  if (!isGALoaded()) {
    console.log('[Analytics - Dev] Purchase:', { transactionId, value, currency, items });
    return;
  }

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
  });
};

// Application-specific events
export const trackApplicationCreated = (applicationId: number, serviceTier: string, country: string) => {
  event({
    action: 'application_created',
    category: 'Application',
    label: `${serviceTier} - ${country}`,
    value: applicationId,
  });
};

export const trackApplicationSubmitted = (applicationId: number, amount: number) => {
  event({
    action: 'application_submitted',
    category: 'Application',
    label: `Application ${applicationId}`,
    value: amount,
  });
};

export const trackPaymentInitiated = (_applicationId: number, amount: number, method: string) => {
  event({
    action: 'payment_initiated',
    category: 'Payment',
    label: method,
    value: amount,
  });
};

export const trackPaymentCompleted = (transactionId: string, amount: number, currency: string = 'NGN') => {
  trackPurchase(transactionId, amount, currency, [
    {
      item_id: transactionId,
      item_name: 'Study Abroad Application',
      price: amount,
      quantity: 1,
    },
  ]);
};

export const trackAddonPurchased = (addonName: string, amount: number) => {
  event({
    action: 'addon_purchased',
    category: 'Add-On',
    label: addonName,
    value: amount,
  });
};

export const trackDocumentUploaded = (documentType: string, applicationId: number) => {
  event({
    action: 'document_uploaded',
    category: 'Document',
    label: documentType,
    value: applicationId,
  });
};

export const trackSignup = (userId: number, method: string = 'email') => {
  if (!isGALoaded()) return;

  window.gtag('event', 'sign_up', {
    method: method,
    user_id: userId,
  });
};

export const trackLogin = (userId: number, method: string = 'email') => {
  if (!isGALoaded()) return;

  window.gtag('event', 'login', {
    method: method,
    user_id: userId,
  });
};

// User properties
export const setUserProperties = (userId: number, properties: Record<string, any>) => {
  if (!isGALoaded()) return;

  window.gtag('set', 'user_properties', {
    user_id: userId,
    ...properties,
  });
};

// Timing tracking
export const trackTiming = (name: string, value: number, category?: string) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'timing_complete', {
    name: name,
    value: value,
    event_category: category || 'Performance',
  });
};

// Error tracking
export const trackError = (description: string, fatal: boolean = false) => {
  if (!isGALoaded()) {
    console.error('[Analytics - Dev] Error:', description);
    return;
  }

  window.gtag('event', 'exception', {
    description: description,
    fatal: fatal,
  });
};

// Search tracking
export const trackSearch = (searchTerm: string, category?: string) => {
  event({
    action: 'search',
    category: category || 'Search',
    label: searchTerm,
  });
};

// Custom dimensions
export const setCustomDimension = (dimension: string, value: string) => {
  if (!isGALoaded()) return;

  window.gtag('set', dimension, value);
};

// Declare gtag on window object for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
