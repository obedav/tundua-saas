import { z } from 'zod';

/**
 * Environment Variable Validation Schema
 *
 * This ensures all required environment variables are present and valid
 * BEFORE the app starts. Prevents runtime errors from missing config.
 *
 * Uses Zod for type-safe validation.
 */

/**
 * Client-side environment variables (exposed to browser)
 * These MUST be prefixed with NEXT_PUBLIC_
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('Invalid API URL').describe('Backend API URL'),
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid App URL').describe('Frontend App URL'),
  NEXT_PUBLIC_PUSHER_KEY: z.string().optional().describe('Pusher API Key for real-time features'),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string().optional().describe('Pusher cluster region'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().describe('Google Analytics Measurement ID'),
});

/**
 * Server-side environment variables (NOT exposed to browser)
 * Only available in server components, API routes, and server actions
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Add server-only env vars here as needed
  // DATABASE_URL: z.string().url().optional(),
  // SECRET_KEY: z.string().min(32).optional(),
});

/**
 * Validate and parse environment variables
 *
 * @throws {ZodError} If validation fails, with detailed error messages
 */
function validateEnv() {
  // Client-side validation (runs in browser)
  const clientEnv = clientEnvSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env['NEXT_PUBLIC_API_URL'],
    NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'],
    NEXT_PUBLIC_PUSHER_KEY: process.env['NEXT_PUBLIC_PUSHER_KEY'],
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env['NEXT_PUBLIC_PUSHER_CLUSTER'],
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'],
  });

  if (!clientEnv.success) {
    console.error('❌ Invalid client environment variables:', clientEnv.error.format());
    throw new Error('Invalid client environment variables. Check console for details.');
  }

  // Server-side validation (only runs on server)
  if (typeof window === 'undefined') {
    const serverEnv = serverEnvSchema.safeParse({
      NODE_ENV: process.env.NODE_ENV,
    });

    if (!serverEnv.success) {
      console.error('❌ Invalid server environment variables:', serverEnv.error.format());
      throw new Error('Invalid server environment variables. Check console for details.');
    }

    return {
      client: clientEnv.data,
      server: serverEnv.data,
    };
  }

  return {
    client: clientEnv.data,
    server: null,
  };
}

/**
 * Validated environment variables
 *
 * Use this instead of process.env for type safety
 */
export const env = validateEnv();

/**
 * Type-safe environment variables for client-side use
 *
 * Example usage:
 * import { clientEnv } from '@/lib/env';
 * const apiUrl = clientEnv.NEXT_PUBLIC_API_URL;
 */
export const clientEnv = env.client;

/**
 * Type-safe environment variables for server-side use
 * Only available in server components
 *
 * Example usage:
 * import { serverEnv } from '@/lib/env';
 * const nodeEnv = serverEnv?.NODE_ENV;
 */
export const serverEnv = env.server;

/**
 * Helper: Check if we're in production
 */
export const isProduction = env.server?.NODE_ENV === 'production' ||
  (typeof window === 'undefined' && process.env.NODE_ENV === 'production');

/**
 * Helper: Check if we're in development
 */
export const isDevelopment = env.server?.NODE_ENV === 'development' ||
  (typeof window === 'undefined' && process.env.NODE_ENV === 'development');

/**
 * Helper: Check if we're in test environment
 */
export const isTest = env.server?.NODE_ENV === 'test' ||
  (typeof window === 'undefined' && process.env.NODE_ENV === 'test');
