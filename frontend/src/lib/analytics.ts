// Google Analytics 4 tracking utility
import { clientEnv } from '@/lib/env';

// Hardcoded fallback matches the gtag <Script> in layout.tsx, so events still
// fire when NEXT_PUBLIC_GA_MEASUREMENT_ID is not set in the environment.
// Keep this in sync with frontend/src/app/layout.tsx.
export const GA_MEASUREMENT_ID =
  clientEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-15M99B1B4W';

// Types for GA events
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string | number;
}

// Check if GA is loaded.
// We only require window.gtag — the measurement ID is configured by the gtag
// <Script> in layout.tsx, so event() calls don't need to know it themselves.
// Requiring an env-var check here was silently no-opping every track* call in
// production whenever NEXT_PUBLIC_GA_MEASUREMENT_ID was missing.
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
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

// Lead generation tracking - GA4 recommended key events
export const trackLeadFormSubmit = (source: string) => {
  if (!isGALoaded()) {
    console.log('[Analytics - Dev] Lead:', { source });
    return;
  }

  // GA4 recommended "generate_lead" event - can be marked as a key event in GA4 admin
  window.gtag('event', 'generate_lead', {
    event_category: 'Lead',
    event_label: source,
    currency: 'NGN',
    value: 1,
  });
};

export const trackLeadFormView = (source: string) => {
  event({
    action: 'lead_form_view',
    category: 'Lead',
    label: source,
  });
};

// CTA click tracking — these are the GA4 key events that should be marked
// as conversions in the GA4 admin (Admin → Events → mark as key event).
export const trackApplyClick = (source: string) => {
  if (!isGALoaded()) {
    console.log('[Analytics - Dev] Apply click:', { source });
    return;
  }

  // Custom event — descriptive name for our own analysis
  window.gtag('event', 'apply_click', {
    event_category: 'CTA',
    event_label: source,
    value: 1,
  });

  // GA4 recommended Lead Gen event — clicking "Apply" means the lead is now
  // "working" through the funnel. Lights up the GA4 Lead Gen funnel report.
  window.gtag('event', 'working_lead', {
    event_category: 'Lead',
    event_label: source,
    currency: 'NGN',
    value: 1,
  });
};

export const trackWhatsAppClick = (source: string) => {
  if (!isGALoaded()) {
    console.log('[Analytics - Dev] WhatsApp click:', { source });
    return;
  }

  // Custom event for our own analysis
  window.gtag('event', 'whatsapp_click', {
    event_category: 'CTA',
    event_label: source,
    value: 1,
  });

  // GA4 recommended Lead Gen event — opening WhatsApp is a real lead handoff,
  // so we count it as generate_lead. Marks the lead as captured in GA4 funnel.
  window.gtag('event', 'generate_lead', {
    event_category: 'Lead',
    event_label: `whatsapp:${source}`,
    currency: 'NGN',
    value: 1,
  });
};

export const trackEligibilityCheck = (budget: string, course: string) => {
  if (!isGALoaded()) {
    console.log('[Analytics - Dev] Eligibility check:', { budget, course });
    return;
  }

  // Custom event with the answers as label
  window.gtag('event', 'eligibility_check', {
    event_category: 'Lead',
    event_label: `${budget} | ${course}`,
    value: 1,
  });

  // GA4 recommended Lead Gen event — completing the quiz means we now know
  // their budget and course, so the lead is qualified. Lights up GA4's
  // qualify_lead funnel stage.
  window.gtag('event', 'qualify_lead', {
    event_category: 'Lead',
    event_label: `${budget} | ${course}`,
    currency: 'NGN',
    value: 1,
  });
};

// Declare gtag on window object for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
