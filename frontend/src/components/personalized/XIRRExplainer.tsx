import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { calculateSIPXIRR } from '../../lib/xirr'
import { formatINR } from '../../lib/formatINR'

export default function XIRRExplainer() {
  const [monthly, setMonthly] = useState(500)
  const [months, setMonths] = useState(12)
  const [hasInteracted, setHasInteracted] = useState({ amount: false, months: false })

  // Calculate a realistic final value based on ~14% annual return
  const finalValue = useMemo(() => {
    const r = 0.14 / 12 // monthly rate
    // FV of annuity formula
    return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
  }, [monthly, months])

  const xirr = useMemo(() => calculateSIPXIRR(monthly, months, finalValue), [monthly, months, finalValue])
  const totalInvested = monthly * months

  const handleMonthlyChange = (v: number) => {
    setMonthly(v)
    setHasInteracted(prev => ({ ...prev, amount: true }))
  }

  const handleMonthsChange = (v: number) => {
    setMonths(v)
    setHasInteracted(prev => ({ ...prev, months: true }))
  }

  // Timeline dots
  const timelineDots = useMemo(() => {
    const show = Math.min(months, 12)
    return Array.from({ length: show }, (_, i) => i + 1)
  }, [months])

  return (
    <div className="space-y-5">

      <h4 className="font-display font-semibold text-base text-white">XIRR — what it actually means</h4>

      {/* Timeline visualization */}
      <div className="rounded-2xl p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="relative">
          {/* Line */}
          <div className="absolute top-3 left-0 right-0 h-[2px]" style={{ background: 'rgba(255,255,255,0.08)' }} />
          {/* Dots */}
          <div className="flex justify-between relative px-2">
            {timelineDots.map((m, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full z-10 mb-2" style={{ background: i === timelineDots.length - 1 ? 'var(--accent)' : 'var(--teal)' }} />
                <span className="font-mono text-[7px] text-white/20">M{m}</span>
                <span className="font-mono text-[8px] text-white/30">{formatINR(monthly)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right mt-3">
          <p className="font-sans text-[10px] text-white/25">Current value:</p>
          <p className="font-display font-semibold text-lg" style={{ color: 'var(--teal)' }}>{formatINR(finalValue)}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(192,241,142,0.03)', borderColor: 'rgba(192,241,142,0.08)' }}>
        <p className="font-sans text-sm text-white/55">
          You invested <span className="text-white">{formatINR(totalInvested)}</span> over <span className="text-white">{months} months</span>.
          Your money grew to <span style={{ color: 'var(--teal)' }}>{formatINR(finalValue)}</span>.
        </p>
        <p className="font-display font-bold text-2xl mt-2" style={{ color: 'var(--accent)' }}>XIRR: {(xirr * 100).toFixed(1)}%</p>
      </div>

      {/* Plain explanation */}
      <p className="font-sans text-sm text-white/50 leading-relaxed">
        XIRR is simply the answer to: if all your SIP investments were one lump sum at one point in time,
        what interest rate would give you this final value? It's your real annual return. Like a school grade for your investment.
      </p>

      {/* Interactive sliders */}
      <div className="space-y-4">
        <div>
          <label className="font-sans text-[11px] text-white/40 uppercase tracking-wider block mb-2">Monthly amount</label>
          <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--accent)' }}>{formatINR(monthly)}</p>
          <input type="range" min={500} max={5000} step={500} value={monthly}
            onChange={e => handleMonthlyChange(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: 'var(--accent)', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div>
          <label className="font-sans text-[11px] text-white/40 uppercase tracking-wider block mb-2">Months invested</label>
          <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--accent)' }}>{months}</p>
          <input type="range" min={6} max={60} step={1} value={months}
            onChange={e => handleMonthsChange(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: 'var(--accent)', background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>

      <p className="font-sans text-xs text-white/30">The higher this number, the harder your money is working.</p>

      {hasInteracted.amount && hasInteracted.months && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-sans text-[10px]" style={{ color: 'var(--teal)' }}>
          You've explored XIRR interactively — nice work.
        </motion.p>
      )}
    </div>
  )
}
