/**
 * Format a number into Indian Rupee shorthand.
 * ₹X.XX Cr for crores, ₹X.XX L for lakhs, ₹X,XXX for smaller values.
 */
export function formatINR(val: number): string {
  if (val >= 1e7) return `₹${(val / 1e7).toFixed(2)} Cr`
  if (val >= 1e5) return `₹${(val / 1e5).toFixed(2)} L`
  return `₹${Math.round(val).toLocaleString('en-IN')}`
}
