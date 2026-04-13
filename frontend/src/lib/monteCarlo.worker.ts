/**
 * Monte Carlo SIP Simulation — Web Worker
 * Runs 600 GBM paths off the main thread.
 *
 * Post message: { monthlyAmount: number, years: number, cagr: number }
 * Returns:       { paths: number[][], p10: number[], p50: number[], p90: number[],
 *                  invested: number[], finalP10: number, finalP50: number, finalP90: number,
 *                  totalInvested: number }
 */

// Box-Muller transform for standard normal random variable
function boxMuller(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

interface SimMessage {
  monthlyAmount: number
  years: number
  cagr: number // as decimal, e.g. 0.14
}

self.onmessage = (e: MessageEvent<SimMessage>) => {
  const { monthlyAmount, years, cagr } = e.data
  const NUM_PATHS = 600
  const months = years * 12
  const annualSigma = 0.18
  const mu = Math.log(1 + cagr) / 12
  const sigma = annualSigma / Math.sqrt(12)

  const paths: number[][] = []

  for (let p = 0; p < NUM_PATHS; p++) {
    const path: number[] = [0]
    let portfolio = 0
    for (let m = 1; m <= months; m++) {
      portfolio += monthlyAmount
      const monthlyReturn = Math.exp(mu - (sigma * sigma) / 2 + sigma * boxMuller()) - 1
      portfolio *= (1 + monthlyReturn)
      path.push(portfolio)
    }
    paths.push(path)
  }

  // Calculate percentiles at each month
  const p10: number[] = []
  const p50: number[] = []
  const p90: number[] = []
  const invested: number[] = []

  for (let m = 0; m <= months; m++) {
    const values = paths.map(p => p[m]).sort((a, b) => a - b)
    const idx10 = Math.floor(NUM_PATHS * 0.10)
    const idx50 = Math.floor(NUM_PATHS * 0.50)
    const idx90 = Math.floor(NUM_PATHS * 0.90)
    p10.push(values[idx10])
    p50.push(values[idx50])
    p90.push(values[idx90])
    invested.push(m * monthlyAmount)
  }

  self.postMessage({
    paths,
    p10,
    p50,
    p90,
    invested,
    finalP10: p10[months],
    finalP50: p50[months],
    finalP90: p90[months],
    totalInvested: months * monthlyAmount,
  })
}
