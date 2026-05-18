'use client'

import { useState, useEffect } from 'react'
import type { UniversityReportRequest } from '@/lib/ai-addons-generator'
import type { GpaScale, Currency } from './university-report-constants'

const EMPTY_FORM: UniversityReportRequest = {
  field: '', degree: '', gpa: 0, budget: 0, country: '', priorities: [], careerGoal: '',
}

export function useUniversityReportDraft() {
  const [formData, setFormData] = useState<UniversityReportRequest>(EMPTY_FORM)
  const [gpaScale, setGpaScale] = useState<GpaScale>('4.0')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [draftSaved, setDraftSaved] = useState(false)
  const [hasSavedDraft, setHasSavedDraft] = useState(false)

  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const savedGpaScale = localStorage.getItem('universityReportGpaScale')
      const savedCurrency = localStorage.getItem('universityReportCurrency')
      if (savedGpaScale || savedCurrency) return
      if (timezone.includes('America')) {
        setGpaScale('4.0')
        setCurrency(timezone.includes('Toronto') || timezone.includes('Vancouver') ? 'CAD' : 'USD')
      } else if (timezone.includes('Europe/London') || timezone === 'Europe/Dublin') {
        setGpaScale('percentage'); setCurrency('GBP')
      } else if (timezone.includes('Europe')) {
        setGpaScale('10.0'); setCurrency('EUR')
      } else if (timezone.includes('Australia')) {
        setGpaScale('4.0'); setCurrency('AUD')
      } else if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
        setGpaScale('10.0'); setCurrency('USD')
      } else if (timezone.includes('Asia/Shanghai') || timezone.includes('Asia/Beijing')) {
        setGpaScale('100'); setCurrency('USD')
      }
    } catch {
      // timezone detection failure is non-fatal
    }
  }, [])

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('universityReportDraft')
      const savedGpaScale = localStorage.getItem('universityReportGpaScale')
      const savedCurrency = localStorage.getItem('universityReportCurrency')
      if (savedDraft) { setFormData(JSON.parse(savedDraft)); setHasSavedDraft(true) }
      if (savedGpaScale) setGpaScale(savedGpaScale as GpaScale)
      if (savedCurrency) setCurrency(savedCurrency as Currency)
    } catch {
      // draft load failure is non-fatal
    }
  }, [])

  useEffect(() => {
    const hasData = formData.field || formData.degree || (formData.gpa as number) > 0 || (formData.budget as number) > 0
    if (!hasData) return
    try {
      localStorage.setItem('universityReportDraft', JSON.stringify(formData))
      localStorage.setItem('universityReportGpaScale', gpaScale)
      localStorage.setItem('universityReportCurrency', currency)
      setDraftSaved(true)
      setHasSavedDraft(true)
      const timer = setTimeout(() => setDraftSaved(false), 2000)
      return () => clearTimeout(timer)
    } catch {
      return undefined
    }
  }, [formData, gpaScale, currency])

  const clearDraft = () => {
    if (!confirm('Are you sure you want to clear your saved draft? This cannot be undone.')) return
    localStorage.removeItem('universityReportDraft')
    localStorage.removeItem('universityReportGpaScale')
    localStorage.removeItem('universityReportCurrency')
    setFormData(EMPTY_FORM)
    setGpaScale('4.0')
    setCurrency('USD')
    setHasSavedDraft(false)
    setDraftSaved(false)
  }

  return {
    formData, setFormData,
    gpaScale, setGpaScale,
    currency, setCurrency,
    draftSaved, hasSavedDraft, clearDraft,
  }
}
