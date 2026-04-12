import { motion } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatINR } from '../../lib/formatINR'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function PortfolioPulse() {
  const simulationResult = useAppStore(s => s.simulationResult)
  const monthlyAmount = useAppStore(s => s.monthlyAmount)
  const years = useAppStore(s => s.years)
  const portfolioPulseView = useAppStore(s => s.portfolioPulseView)
  const setPortfolioPulseView = useAppStore(s => s.setPortfolioPulseView)
  const setDashboardSection = useAppStore(s => s.setDashboardSection)

  const hasSimulation = !!simulationResult

  // Simulate daily changes (seeded by date for consistency)
  const dailyData = useMemo(() => {
    const seed = new Date().getDate()
    const days: number[] = []
    for (let i = 0; i < 30; i++) {
      const pseudoRandom = Math.sin(seed * 127 + i * 31) * 0.5 + 0.5
      days.push((pseudoRandom - 0.45) * 3) // ±1.5% range, slightly positive bias
    }
    return days
  }, [])

  const todaysChange = dailyData[dailyData.length - 1]
  const todaysPositive = todaysChange >= 0

  // Calculate invested and current from simulation
  const totalInvested = hasSimulation ? simulationResult.totalInvested : monthlyAmount * years * 12
  const currentValue = hasSimulation ? simulationResult.p50 : 0
  const totalReturn = currentValue - totalInvested
  const totalReturnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

  const todayRupee = hasSimulation ? currentValue * (todaysChange / 100) : 0

  // Week data (last 7 of the 30 days)
  const weekData = dailyData.slice(-7)
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // 30-day sparkline
  const sparkline = useMemo(() => {
    let cumulative = 1000
    const points: number[] = [cumulative]
    for (const d of dailyData) {
      cumulative *= (1 + d / 100)
      points.push(cumulative)
    }
    return points
  }, [dailyData])

  const sparkEnding = sparkline[sparkline.length - 1] > sparkline[0]
  const sparkColor = sparkEnding ? 'var(--teal)' : 'var(--danger)'

  const renderSparkline = () => {
    const min = Math.min(...sparkline)
    const max = Math.max(...sparkline)
    const range = max - min || 1
    const w = 120
    const h = 40
    const points = sparkline.map((v, i) => `${(i / (sparkline.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline points={points} fill="none" stroke={sparkColor} strokeWidth="1.5" />
      </svg>
    )
  }

  // Pulse animation for today's change
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (!hasSimulation) return
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    }, 8000)
    return () => clearInterval(interval)
  }, [hasSimulation])

  // 2x progress
  const goalProgress = hasSimulation ? Math.min((currentValue / (totalInvested * 2)) * 100, 100) : 0

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="rounded-3xl p-7 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

      {/* Toggle */}
      {hasSimulation && (
        <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {(['day', 'total'] as const).map(v => (
            <button key={v} onClick={() => setPortfolioPulseView(v)}
              className="px-4 py-1.5 rounded-lg font-sans text-[11px] font-medium transition-[background-color,color] duration-200"
              style={{
                background: portfolioPulseView === v ? 'rgba(192,241,142,0.08)' : 'transparent',
                color: portfolioPulseView === v ? 'var(--accent)' : 'var(--text-secondary)',
              }}>
              {v === 'day' ? 'Day-to-day' : 'Total view'}
            </button>
          ))}
        </div>
      )}

      {!hasSimulation ? (
        /* Placeholder state */
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-6">
              {['Today', 'Invested', 'Current'].map(label => (
                <div key={label}>
                  <p className="text-[9px] font-sans text-white/25 uppercase mb-1">{label}</p>
                  <p className="font-display font-semibold text-lg text-white/15">—</p>
                </div>
              ))}
            </div>
            <p className="font-sans text-xs text-white/30">Run your simulation to see your portfolio pulse</p>
            <button onClick={() => setDashboardSection('simulation')}
              className="px-5 py-2 rounded-full font-sans font-bold text-xs text-[#0a1a00]"
              style={{ background: 'var(--accent)' }}>
              Run simulation →
            </button>
          </div>
          <div className="hidden md:block opacity-20">{renderSparkline()}</div>
        </div>
      ) : portfolioPulseView === 'day' ? (
        /* Day-to-day view */
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-4">
            {/* Today's change */}
            <div>
              <p className="text-[9px] font-sans text-white/25 uppercase mb-1">Today</p>
              <motion.p animate={{ opacity: pulse ? 0.7 : 1 }} className="font-display font-bold text-2xl"
                style={{ color: todaysPositive ? 'var(--teal)' : 'var(--danger)' }}>
                {todaysPositive ? '+' : ''}{formatINR(Math.abs(todayRupee))}
                <span className="text-sm font-mono ml-1">({todaysPositive ? '+' : ''}{todaysChange.toFixed(1)}%)</span>
              </motion.p>
            </div>

            {/* Week bars */}
            <div>
              <p className="text-[9px] font-sans text-white/20 uppercase mb-2">This week</p>
              <div className="flex items-end gap-1.5 h-8">
                {weekData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-4 rounded-sm" style={{
                      height: `${Math.max(Math.abs(d) * 8, 3)}px`,
                      background: d >= 0 ? 'var(--teal)' : 'var(--danger)',
                    }} />
                    <span className="font-mono text-[7px] text-white/15">{dayNames[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-sans text-[10px] text-white/20">
              Based on your {formatINR(monthlyAmount)}/month SIP simulation
            </p>
          </div>
          <div className="hidden md:block shrink-0">{renderSparkline()}</div>
        </div>
      ) : (
        /* Total view */
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[9px] font-sans text-white/25 uppercase mb-1">Invested</p>
                <p className="font-display font-semibold text-xl text-white">{formatINR(totalInvested)}</p>
              </div>
              <div>
                <p className="text-[9px] font-sans text-white/25 uppercase mb-1">Current</p>
                <p className="font-display font-semibold text-xl" style={{ color: 'var(--teal)' }}>{formatINR(currentValue)}</p>
              </div>
            </div>

            <p className="font-mono text-sm" style={{ color: totalReturn >= 0 ? 'var(--teal)' : 'var(--danger)' }}>
              {totalReturn >= 0 ? <TrendingUp className="w-3.5 h-3.5 inline mr-1" /> : <TrendingDown className="w-3.5 h-3.5 inline mr-1" />}
              {totalReturn >= 0 ? '+' : ''}{formatINR(Math.abs(totalReturn))} ({totalReturnPct.toFixed(1)}% return)
            </p>

            {/* 2x progress */}
            <div>
              <p className="text-[9px] font-sans text-white/20 uppercase mb-1.5">Progress to 2x your investment</p>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${goalProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full" style={{ background: 'var(--accent)' }} />
              </div>
              <p className="font-mono text-[9px] text-white/15 mt-1">{goalProgress.toFixed(0)}%</p>
            </div>
          </div>
          <div className="hidden md:block shrink-0">{renderSparkline()}</div>
        </div>
      )}
    </motion.div>
  )
}
