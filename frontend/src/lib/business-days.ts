import { addDays, differenceInBusinessDays, isWeekend } from 'date-fns';

/**
 * Calculate business days remaining (excluding weekends)
 */
export function calculateBusinessDaysRemaining(
  approvedDate: Date,
  totalBusinessDays: number = 90
): number {
  const today = new Date();
  const daysPassed = differenceInBusinessDays(today, approvedDate);
  const remaining = totalBusinessDays - daysPassed;

  return Math.max(0, remaining);
}

/**
 * Calculate refund due date (90 business days from approval)
 */
export function calculateRefundDueDate(approvedDate: Date): Date {
  let dueDate = new Date(approvedDate);
  let businessDaysAdded = 0;

  while (businessDaysAdded < 90) {
    dueDate = addDays(dueDate, 1);
    if (!isWeekend(dueDate)) {
      businessDaysAdded++;
    }
  }

  return dueDate;
}

/**
 * Format countdown for display
 */
export function formatCountdown(daysRemaining: number): string {
  if (daysRemaining <= 0) return '0 days';
  if (daysRemaining === 1) return '1 day';
  return `${daysRemaining} days`;
}

/**
 * Get countdown color based on days remaining
 */
export function getCountdownColor(daysRemaining: number): string {
  if (daysRemaining > 60) return 'text-green-600';
  if (daysRemaining > 30) return 'text-yellow-600';
  if (daysRemaining > 7) return 'text-orange-600';
  return 'text-red-600';
}
