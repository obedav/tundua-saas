/**
 * UK Study Visa & Financial Data — Single Source of Truth
 *
 * All articles, pages, and tools that reference UK visa fees, maintenance
 * requirements, or immigration figures MUST import from here.
 *
 * Change a value once → the entire site updates automatically.
 *
 * Sources:
 *   - UK Visas and Immigration (UKVI): https://www.gov.uk/student-visa
 *   - Home Office fee schedule: https://www.gov.uk/government/publications/visa-regulations-revised-table
 *   - UKVI maintenance requirements: https://www.gov.uk/student-visa/money
 *   - Immigration Health Surcharge: https://www.gov.uk/healthcare-immigration-application
 *
 * Last verified: September 2026
 */

// ── Visa Application Fees ────────────────────────────────────────────────────

/** UK Student Visa fee (Tier 4 / Student route) — changed from £524 to £558 on 8 April 2026 */
export const UK_STUDENT_VISA_FEE = 558;

/** UK Short-stay study visa fee (for courses ≤ 6 months) */
export const UK_SHORT_STAY_STUDY_VISA_FEE = 200;

// ── Immigration Health Surcharge (IHS) ───────────────────────────────────────

/** IHS annual rate per adult applicant */
export const UK_IHS_ANNUAL_RATE = 776;

/** IHS annual rate per child applicant */
export const UK_IHS_ANNUAL_RATE_CHILD = 388;

// ── Maintenance (Proof of Funds) Requirements ────────────────────────────────

/** Monthly maintenance requirement for students studying in London */
export const UK_MAINTENANCE_LONDON_MONTHLY = 1_529;

/** Monthly maintenance requirement for students studying outside London */
export const UK_MAINTENANCE_OUTSIDE_LONDON_MONTHLY = 1_171;

/** Number of months the maintenance must be held before application */
export const UK_MAINTENANCE_PERIOD_MONTHS = 9;

/** Total maintenance funds required for London (9 × monthly rate) */
export const UK_MAINTENANCE_LONDON_TOTAL =
  UK_MAINTENANCE_LONDON_MONTHLY * UK_MAINTENANCE_PERIOD_MONTHS;

/** Total maintenance funds required outside London (9 × monthly rate) */
export const UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL =
  UK_MAINTENANCE_OUTSIDE_LONDON_MONTHLY * UK_MAINTENANCE_PERIOD_MONTHS;

/** Number of consecutive days funds must be held before the application date */
export const UK_MAINTENANCE_BANK_STATEMENT_DAYS = 28;

// ── Work Rights During Study ─────────────────────────────────────────────────

/** Maximum hours per week a student can work during term time */
export const UK_WORK_HOURS_TERM_TIME = 20;

/** Work rights during official vacation periods */
export const UK_WORK_HOURS_VACATION = "Full time" as const;

// ── Graduate Route (Post-Study Work Visa) ────────────────────────────────────

/** Graduate Route duration for Bachelor's and Master's graduates */
export const UK_GRADUATE_ROUTE_DURATION_BACHELORS_MASTERS_YEARS = 2;

/** Graduate Route duration for PhD / doctoral graduates */
export const UK_GRADUATE_ROUTE_DURATION_PHD_YEARS = 3;

/** Graduate Route visa fee */
export const UK_GRADUATE_ROUTE_FEE = 822;

// ── English Language Requirements ────────────────────────────────────────────

/** Minimum IELTS Academic overall band for most UK Master's programmes */
export const UK_IELTS_MASTERS_MINIMUM = 6.0;

/** Minimum IELTS Academic overall band for most UK Bachelor's programmes */
export const UK_IELTS_BACHELORS_MINIMUM = 5.5;

// ── Deposit & Tuition Benchmarks ─────────────────────────────────────────────

/** Typical low-deposit threshold — universities offering this are considered budget-friendly */
export const UK_LOW_DEPOSIT_THRESHOLD_GBP = 5_000;

/** Approximate lower bound for postgraduate tuition at UK universities */
export const UK_TUITION_LOW_GBP = 10_000;

/** Approximate upper bound for postgraduate tuition at UK universities */
export const UK_TUITION_HIGH_GBP = 32_000;

// ── Country-Specific Visa Refusal Rates (latest published data) ───────────────

/**
 * UK Student Visa refusal rates by country of application.
 * Source: Home Office Immigration Statistics.
 * NOTE: These change each quarter — verify before publishing.
 */
export const UK_VISA_REFUSAL_RATES = {
  /** Nigeria */
  NG: 10.34,
  /** Ghana */
  GH: 16.72,
  /** Kenya */
  KE: 7.8,
  /** India */
  IN: 3.2,
  /** Pakistan */
  PK: 22.1,
} as const;

// ── Type helpers ─────────────────────────────────────────────────────────────

export type CountryCode = keyof typeof UK_VISA_REFUSAL_RATES;

/** Returns a formatted string for the total London maintenance requirement */
export function formatLondonMaintenance(): string {
  return `£${UK_MAINTENANCE_LONDON_TOTAL.toLocaleString()}`;
}

/** Returns a formatted string for the total outside-London maintenance requirement */
export function formatOutsideLondonMaintenance(): string {
  return `£${UK_MAINTENANCE_OUTSIDE_LONDON_TOTAL.toLocaleString()}`;
}
