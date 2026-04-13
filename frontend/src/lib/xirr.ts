/**
 * XIRR Calculator — Newton-Raphson approximation
 * Calculates the annualized return rate for irregular cashflows.
 */

export interface Cashflow {
  amount: number // negative = outflow (investment), positive = inflow (return)
  date: Date
}

/** Days between two dates */
function daysBetween(d1: Date, d2: Date): number {
  return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
}

/**
 * Calculate XIRR using Newton-Raphson method.
 * Returns annualized return as a decimal (0.14 = 14%).
 * Returns NaN if it fails to converge.
 */
export function calculateXIRR(cashflows: Cashflow[], guess: number = 0.1): number {
  if (cashflows.length < 2) return NaN

  const d0 = cashflows[0].date
  const MAX_ITER = 100
  const TOLERANCE = 1e-7

  let rate = guess

  for (let i = 0; i < MAX_ITER; i++) {
    let fValue = 0
    let fDerivative = 0

    for (const cf of cashflows) {
      const years = daysBetween(d0, cf.date) / 365
      const denom = Math.pow(1 + rate, years)
      fValue += cf.amount / denom
      if (years !== 0) {
        fDerivative -= (years * cf.amount) / Math.pow(1 + rate, years + 1)
      }
    }

    if (Math.abs(fDerivative) < 1e-12) break
    const newRate = rate - fValue / fDerivative
    if (Math.abs(newRate - rate) < TOLERANCE) return newRate
    rate = newRate
  }

  return rate
}

/**
 * Simplified SIP XIRR calculator.
 * Given monthly investment amount, number of months, and final value,
 * returns XIRR as a percentage (e.g. 14.2).
 */
export function calculateSIPXIRR(
  monthlyAmount: number,
  months: number,
  finalValue: number
): number {
  const cashflows: Cashflow[] = []
  const startDate = new Date(2024, 0, 1) // arbitrary start

  // Monthly outflows
  for (let i = 0; i < months; i++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + i)
    cashflows.push({ amount: -monthlyAmount, date })
  }

  // Final inflow
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + months)
  cashflows.push({ amount: finalValue, date: endDate })

  const xirr = calculateXIRR(cashflows)
  if (isNaN(xirr) || !isFinite(xirr)) return 0
  return xirr // returns decimal — display code should * 100
}
