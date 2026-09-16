/**
 * Canada Study & Immigration Data — Single Source of Truth
 *
 * All articles, pages, and tools referencing Canadian study permit fees,
 * living funds, or immigration figures MUST import from here.
 *
 * Sources:
 *   - IRCC Study Permit: https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html
 *   - IRCC Fee list: https://www.ircc.canada.ca/english/information/fees/index.asp
 *   - IRCC Proof of funds: https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html#financial-support
 *
 * Last verified: September 2026
 */

// ── Study Permit Fees ────────────────────────────────────────────────────────

/** Canada Study Permit application fee (IRCC) */
export const CANADA_STUDY_PERMIT_FEE_CAD = 150;

/** Canada Biometrics fee (most applicants from Nigeria) */
export const CANADA_BIOMETRICS_FEE_CAD = 85;

/** Canada Student Direct Stream (SDS) — not available for all countries */
export const CANADA_SDS_AVAILABLE_FOR_NIGERIA = false;

// ── Proof of Funds / Living Requirements ─────────────────────────────────────

/**
 * IRCC minimum living funds required per year outside Quebec.
 * Students must demonstrate: tuition fees + this amount + transport.
 * NOTE: IRCC updated the calculation method in 2024 — always verify with
 * official IRCC guidance before publishing.
 */
export const CANADA_LIVING_FUNDS_OUTSIDE_QUEBEC_CAD = 10_000;

/** IRCC minimum living funds per year for Quebec */
export const CANADA_LIVING_FUNDS_QUEBEC_CAD = 11_000;

/**
 * Total estimated proof of funds for a 1-year programme outside Quebec.
 * This is a guidance estimate: tuition + living + transport.
 * Actual figure depends on individual university tuition.
 * NOTE: Newer IRCC guidance (from 2024) ties living funds to the LICO —
 * the exact annual figure changes. Check gov.ca for the current rate.
 */
export const CANADA_TOTAL_PROOF_OF_FUNDS_GUIDE_CAD = 22_895;

// ── Medical Examination Fees (IOM Nigeria) ───────────────────────────────────

/**
 * Canada immigration medical examination fee at IOM Lagos / IOM Abuja.
 * Fees are quoted in USD by IOM and converted at point of payment.
 * These can change — verify with IOM Nigeria before publishing.
 */
export const CANADA_MEDICAL_EXAM_FEE_USD = 210;

/** Chest X-ray add-on at IOM (when required) */
export const CANADA_MEDICAL_XRAY_FEE_USD = 60;

// ── Typical Tuition Benchmarks ────────────────────────────────────────────────

/** Approximate lower bound for international undergraduate tuition at Canadian universities */
export const CANADA_TUITION_UNDERGRADUATE_LOW_CAD = 18_000;

/** Approximate upper bound for international undergraduate tuition */
export const CANADA_TUITION_UNDERGRADUATE_HIGH_CAD = 45_000;

/** Approximate lower bound for international graduate tuition */
export const CANADA_TUITION_GRADUATE_LOW_CAD = 12_000;

/** Approximate upper bound for international graduate tuition */
export const CANADA_TUITION_GRADUATE_HIGH_CAD = 40_000;

// ── Visa/Permit Processing Times ─────────────────────────────────────────────

/** Current estimated study permit processing time (weeks) for applicants from Nigeria */
export const CANADA_STUDY_PERMIT_PROCESSING_WEEKS = 8;

/** Medical validity period (months) */
export const CANADA_MEDICAL_VALIDITY_MONTHS = 12;

// ── Work Rights ───────────────────────────────────────────────────────────────

/** Maximum weekly work hours on or off campus during academic sessions */
export const CANADA_WORK_HOURS_ACADEMIC_SESSION = 24;

/** Work rights during scheduled academic breaks */
export const CANADA_WORK_HOURS_BREAK = "Full time" as const;

// ── Post-Graduation Work Permit (PGWP) ───────────────────────────────────────

/** Maximum PGWP duration for programmes ≥ 2 years */
export const CANADA_PGWP_MAX_YEARS = 3;

// ── Country-Specific Visa Refusal Rates ──────────────────────────────────────

/**
 * Canada Study Permit refusal rate for Nigerian applicants.
 * Source: IRCC quarterly statistics. NOTE: Verify before publishing.
 */
export const CANADA_STUDY_PERMIT_REFUSAL_RATE_NG_PERCENT = 46;
