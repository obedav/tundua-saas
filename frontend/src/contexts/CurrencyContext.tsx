"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Currency = 'NGN' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (amount: number | null, options?: FormatOptions) => string;
  isNigeria: boolean;
}

interface FormatOptions {
  showCurrency?: boolean;
  decimals?: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Currency symbols
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: '₦',
  USD: '$',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [isNigeria, setIsNigeria] = useState(false);

  // Initialize currency from localStorage or detect from location
  useEffect(() => {
    const detectCurrency = async () => {
      // First check localStorage
      const savedCurrency = localStorage.getItem('preferred_currency') as Currency | null;
      if (savedCurrency && (savedCurrency === 'NGN' || savedCurrency === 'USD')) {
        setCurrencyState(savedCurrency);
        setIsNigeria(savedCurrency === 'NGN');
        return;
      }

      // Try to detect from browser timezone/locale
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isNigerianTimezone = timezone.includes('Lagos') || timezone.includes('Africa/Lagos');

        // Also check locale
        const locale = navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage || 'en-US';
        const isNigerianLocale = locale.includes('NG') || locale.includes('ng');

        if (isNigerianTimezone || isNigerianLocale) {
          setCurrencyState('NGN');
          setIsNigeria(true);
        } else {
          setCurrencyState('USD');
          setIsNigeria(false);
        }
      } catch {
        // Default to USD if detection fails
        setCurrencyState('USD');
        setIsNigeria(false);
      }
    };

    detectCurrency();
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('preferred_currency', newCurrency);
    setIsNigeria(newCurrency === 'NGN');
  }, []);

  const toggleCurrency = useCallback(() => {
    const newCurrency = currency === 'NGN' ? 'USD' : 'NGN';
    setCurrency(newCurrency);
  }, [currency, setCurrency]);

  const formatPrice = useCallback((amount: number | null, options: FormatOptions = {}): string => {
    if (amount === null || amount === undefined) {
      return 'Custom Quote';
    }

    const { showCurrency = true, decimals } = options;
    const symbol = CURRENCY_SYMBOLS[currency];

    // NGN typically doesn't use decimals, USD uses 2 decimals
    const decimalPlaces = decimals !== undefined ? decimals : (currency === 'NGN' ? 0 : 2);

    const formattedNumber = new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(amount);

    if (!showCurrency) {
      return formattedNumber;
    }

    return `${symbol}${formattedNumber}`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      toggleCurrency,
      formatPrice,
      isNigeria
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Utility component for currency toggle
export function CurrencyToggle({ className = '' }: { className?: string }) {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <button
      onClick={toggleCurrency}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm font-medium ${className}`}
      aria-label={`Switch to ${currency === 'NGN' ? 'USD' : 'NGN'}`}
    >
      <span className={currency === 'NGN' ? 'text-primary-600 font-semibold' : 'text-gray-400'}>
        ₦ NGN
      </span>
      <span className="text-gray-300">|</span>
      <span className={currency === 'USD' ? 'text-primary-600 font-semibold' : 'text-gray-400'}>
        $ USD
      </span>
    </button>
  );
}
