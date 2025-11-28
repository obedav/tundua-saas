/**
 * Central export for all Server Actions
 *
 * This file provides a single import point for all server actions.
 * Usage: import { loginAction, getApplications } from '@/lib/actions'
 */

// Auth actions
export * from './auth'

// Application actions
export * from './applications'

// Document actions
export * from './documents'

// Payment & Refund actions
export * from './payments'

// Dashboard actions
export * from './dashboard'

// Add-on actions
export * from './addons'

// Service actions
export * from './services'

// Notification actions
export * from './notifications'

// Activity actions
export * from './activity'

// Referral actions
export * from './referrals'

// University actions
export * from './universities'

// Knowledge Base actions
export * from './knowledge-base'

// Admin actions
export * as adminApplications from './admin/applications'
export * as adminDocuments from './admin/documents'
export * as adminUsers from './admin/users'
export * as adminRefunds from './admin/refunds'
export * as adminAddons from './admin/addons'
export * as adminAnalytics from './admin/analytics'
