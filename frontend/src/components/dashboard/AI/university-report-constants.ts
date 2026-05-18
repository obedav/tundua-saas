import type { UniversityReportRequest } from '@/lib/ai-addons-generator'

export type GpaScale = '4.0' | '10.0' | '100' | 'percentage'
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'

export const degreeOptions = ["Bachelor's", "Master's", "PhD", "MBA", "Other Graduate Program"]

export const priorityOptions = [
  { value: 'research', label: 'Research Opportunities' },
  { value: 'location', label: 'Location/Climate' },
  { value: 'ranking', label: 'University Ranking' },
  { value: 'cost', label: 'Affordable Tuition' },
  { value: 'career', label: 'Career Services' },
  { value: 'diversity', label: 'Student Diversity' },
]

export const popularCountries = [
  { value: 'United States', label: '🇺🇸 United States' },
  { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
  { value: 'Canada', label: '🇨🇦 Canada' },
  { value: 'Australia', label: '🇦🇺 Australia' },
  { value: 'Germany', label: '🇩🇪 Germany' },
  { value: 'France', label: '🇫🇷 France' },
  { value: 'Netherlands', label: '🇳🇱 Netherlands' },
  { value: 'Switzerland', label: '🇨🇭 Switzerland' },
  { value: 'Singapore', label: '🇸🇬 Singapore' },
  { value: 'Japan', label: '🇯🇵 Japan' },
]

export const fieldSuggestions = [
  'Computer Science', 'Business Administration', 'Engineering', 'Medicine', 'Law',
  'Psychology', 'Economics', 'Biology', 'Mathematics', 'Physics', 'Chemistry',
  'Data Science', 'Artificial Intelligence', 'Mechanical Engineering',
  'Electrical Engineering', 'Civil Engineering', 'Marketing', 'Finance',
  'Accounting', 'Nursing', 'Education', 'Architecture', 'Journalism',
  'Political Science', 'Environmental Science',
]

export const gpaScales = [
  { value: '4.0' as GpaScale, label: '4.0 Scale (USA)', max: 4.0, placeholder: '3.5' },
  { value: '10.0' as GpaScale, label: '10.0 Scale (India/Europe)', max: 10.0, placeholder: '8.5' },
  { value: '100' as GpaScale, label: '100 Scale (China)', max: 100, placeholder: '85' },
  { value: 'percentage' as GpaScale, label: 'Percentage (UK)', max: 100, placeholder: '75' },
]

export const currencies = [
  { value: 'USD' as Currency, label: '$ USD', symbol: '$', rate: 1.0 },
  { value: 'EUR' as Currency, label: '€ EUR', symbol: '€', rate: 0.92 },
  { value: 'GBP' as Currency, label: '£ GBP', symbol: '£', rate: 0.79 },
  { value: 'CAD' as Currency, label: 'C$ CAD', symbol: 'C$', rate: 1.36 },
  { value: 'AUD' as Currency, label: 'A$ AUD', symbol: 'A$', rate: 1.53 },
]

export function getMaxGPA(scale: GpaScale): number {
  return gpaScales.find(s => s.value === scale)?.max ?? 4.0
}

export function convertToUSD(amount: number, currency: Currency): number {
  const rate = currencies.find(c => c.value === currency)?.rate ?? 1.0
  return amount / rate
}

export function normalizeGPATo4Scale(gpa: number, scale: GpaScale): number {
  switch (scale) {
    case '4.0': return gpa
    case '10.0': return gpa * 0.4
    case '100':
    case 'percentage': return gpa * 0.04
    default: return gpa
  }
}

export function validateGPA(value: number, scale: GpaScale): string {
  const max = getMaxGPA(scale)
  if (value < 0) return 'GPA cannot be negative'
  if (value > max) return `GPA cannot exceed ${max} on this scale`
  return ''
}

export function validateBudget(value: number): string {
  if (value < 0) return 'Budget cannot be negative'
  if (value < 3000) return 'Tuition budget seems too low. Minimum $3,000/year recommended'
  if (value > 100000) return 'Tuition budget seems very high. Please verify the amount'
  return ''
}

export function calculateProgress(formData: UniversityReportRequest) {
  const fields = [
    { name: 'Field of Study', filled: !!formData.field },
    { name: 'Degree Level', filled: !!formData.degree },
    { name: 'GPA', filled: (formData.gpa as number) > 0 },
    { name: 'Budget', filled: (formData.budget as number) > 0 },
  ]
  const filledCount = fields.filter(f => f.filled).length
  const percentage = Math.round((filledCount / fields.length) * 100)
  return {
    filledCount,
    totalCount: fields.length,
    percentage,
    isComplete: filledCount === fields.length,
    missingFields: fields.filter(f => !f.filled).map(f => f.name),
  }
}
