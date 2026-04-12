import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { formatINR } from '../../lib/formatINR'
import { FY_ANNUAL_RETURNS, FY_ARJUN_INSIGHTS, getAllFYKeys, getFYHumanLabel } from '../../lib/sandboxData'
import { Zap } from 'lucide-react'

const FD_RATE = 6.8

export default function FYComparison() {
  const [selectedFY, setSelectedFY] = useState('FY20')
  const fyKeys = getAllFYKeys()

  const results = useMemo(() => {
    const annual = FY_ANNUAL_RETURNS[selectedFY]
    if (!annual) return null
    const base = 10000
    return {
      nifty: { value: base * (1 + annual.nifty / 100), pct: annual.nifty },
      midcap: { value: base * (1 + annual.midcap / 100), pct: annual.midcap },
      smallcap: { value: base * (1 + annual.smallcap / 100), pct: annual.smallcap },
      fd: { value: base * (1 + FD_RATE / 100), pct: FD_RATE },
    }
  }, [selectedFY])

  if (!results) return null

  const allValues = [results.nifty.value, results.midcap.value, results.smallcap.value, results.fd.value]
  const maxValue = Math.max(...allValues)

  const bars = [
    { name: 'Nifty 50 Index Fund', ...results.nifty, color: results.nifty.pct >= 0 ? 'var(--teal)' : 'var(--danger)' },
    { name: 'Midcap Fund', ...results.midcap, color: results.midcap.pct >= 0 ? 'var(--teal)' : 'var(--danger)' },
    { name: 'Smallcap Fund', ...results.smallcap, color: results.smallcap.pct >= 0 ? 'var(--teal)' : 'var(--danger)' },
    { name: 'FD (6.8%)', ...results.fd, color: 'var(--accent)' },
  ]

  const insight = FY_ARJUN_INSIGHTS[selectedFY] || ''

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="rounded-3xl p-7 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

      <h3 className="font-display font-medium text-base text-white mb-1">What ₹10,000 would have become</h3>
      <p className="font-sans text-xs text-white/30 mb-5">Pick any financial year and see how each asset class performed.</p>

      {/* Year Pills */}
      <div className="overflow-x-auto pb-2 mb-6 -mx-2">
        <div className="flex gap-2 px-2 min-w-max">
          {fyKeys.map(fy => {
            const isActive = selectedFY === fy
            return (
              <button key={fy} onClick={() => setSelectedFY(fy)}
                className="group relative px-3 py-1.5 rounded-xl font-mono text-[11px] border transition-[background-color,border-color,color] duration-200 shrink-0"
                style={{
                  background: isActive ? 'rgba(192,241,142,0.08)' : 'transparent',
                  borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                  color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
                }}>
                {getFYHumanLabel(fy)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-4 mb-6">
        {bars.map((bar, i) => (
          <div key={bar.name}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-sans text-sm text-white/60">{bar.name}</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium text-white">{formatINR(bar.value)}</p>
                <p className="font-mono text-[10px]" style={{ color: bar.color }}>
                  ({bar.pct > 0 ? '+' : ''}{bar.pct.toFixed(1)}%)
                </p>
              </div>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max((bar.value / maxValue) * 100, 2)}%` }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: bar.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Arjun insight */}
      {insight && (
        <div className="rounded-2xl p-4 border mb-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderLeft: '3px solid var(--accent)' }}>
          <div className="flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
            <p className="font-sans text-xs text-white/50 leading-relaxed">{insight}</p>
          </div>
        </div>
      )}

      {/* Key insight */}
      <p className="font-sans text-sm font-medium text-center" style={{ color: 'var(--accent)' }}>
        Diversification isn't about picking winners. It's about not losing to the wrong year.
      </p>
    </motion.div>
  )
}
