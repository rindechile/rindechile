import { useCallback } from 'react';
import { formatCurrency as formatCurrencyFn, formatNumber as formatNumberFn } from '@/lib/utils';

/**
 * Custom hook for number, currency, and percentage formatting
 * Centralizes formatting logic used across multiple components
 */
export function useFormatters() {
  const formatNumber = useCallback((num: number) => {
    return formatNumberFn(num);
  }, []);

  const formatPercentage = useCallback((num: number, decimals = 2) => {
    return `${num.toFixed(decimals)}%`;
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return formatCurrencyFn(value);
  }, []);

  return { formatNumber, formatPercentage, formatCurrency };
}
