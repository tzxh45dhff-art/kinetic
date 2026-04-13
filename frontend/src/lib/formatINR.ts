/**
 * Format a number into Indian Rupee shorthand.
 * Handles negatives, and all ranges: Cr, L, K, and below.
 */
export function formatINR(val: number): string {
  const abs = Math.abs(val)
  const sign = val < 0 ? '-' : ''
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}K`
  return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`
}

/**
 * Safe display guard — prevents NaN, Infinity, or undefined from reaching the UI.
 */
export function safeDisplay(val: number | undefined | null, fallback = '—'): string {
  if (val === undefined || val === null || isNaN(val) || !isFinite(val)) return fallback
  return formatINR(val)
}

/**
 * Format percentage with exactly 1 decimal place.
 * Input should be a decimal (e.g. 0.142 → "14.2%").
 */
export function formatPct(decimal: number, fallback = '—'): string {
  if (isNaN(decimal) || !isFinite(decimal)) return fallback
  return `${(decimal * 100).toFixed(1)}%`
}
