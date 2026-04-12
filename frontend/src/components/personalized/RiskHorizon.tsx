import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { getRangeForPeriod, getCaption } from '../../lib/riskHorizonData'
import { CRASH_HISTORY, type CrashEvent } from '../../lib/crashData'
import { ChevronRight } from 'lucide-react'

// ── Crash Marker (small triangle indicators) ────────────────────────────────

function CrashTriangle({
  type,
  crash,
}: {
  type: 'crash' | 'recovery'
  crash: CrashEvent
}) {
  const [hovered, setHovered] = useState(false)
  const color = type === 'crash' ? 'var(--danger)' : 'var(--teal)'

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-20 cursor-pointer"
      style={{ top: type === 'crash' ? '-2px' : '-2px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Triangle */}
      <div style={{
        width: 0,
        height: 0,
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        ...(type === 'crash'
          ? { borderTop: `6px solid ${color}` }
          : { borderBottom: `6px solid ${color}` }),
      }} />

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: type === 'crash' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg whitespace-nowrap z-30 pointer-events-none"
            style={{
              [type === 'crash' ? 'bottom' : 'top']: '100%',
              marginBottom: type === 'crash' ? '4px' : undefined,
              marginTop: type === 'recovery' ? '4px' : undefined,
              background: type === 'crash' ? 'rgba(226,75,74,0.12)' : 'rgba(29,158,117,0.12)',
              border: `1px solid ${type === 'crash' ? 'rgba(226,75,74,0.25)' : 'rgba(29,158,117,0.25)'}`,
            }}
          >
            <p className="font-sans text-[9px] font-medium" style={{ color }}>
              {type === 'crash' ? crash.name : `Recovery from ${crash.name}`}
            </p>
            <p className="font-mono text-[8px] text-white/30">
              {type === 'crash' ? `${crash.niftyPeakToDrop}%` : `+${crash.recoveryGain}%`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Crash Marker Dot (for the timeline below the chart) ─────────────────────

function CrashDot({
  crash,
  onNavigate,
}: {
  crash: CrashEvent
  onNavigate: (fy: string) => void
}) {
  const [hovered, setHovered] = useState(false)

  const dotColor = crash.severity === 'extreme'
    ? 'var(--danger)'
    : crash.severity === 'severe'
      ? 'var(--danger)'
      : 'rgba(226,75,74,0.5)'

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="rounded-full"
        style={{
          width: crash.severity === 'extreme' ? 8 : 6,
          height: crash.severity === 'extreme' ? 8 : 6,
          background: dotColor,
        }}
        animate={crash.severity === 'extreme' ? { scale: [1, 1.3, 1] } : {}}
        transition={crash.severity === 'extreme' ? { duration: 2, repeat: Infinity } : {}}
      />
      <p className="font-mono text-[7px] text-white/20 mt-1 whitespace-nowrap">
        {crash.startDate.split('-')[1]}
      </p>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute bottom-full mb-3 rounded-xl p-3 z-40 w-[180px]"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <p className="font-sans text-[10px] text-white/60 font-medium mb-1">{crash.name}</p>
            <p className="font-mono text-[9px] mb-2" style={{ color: 'var(--danger)' }}>{crash.niftyPeakToDrop}%</p>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(crash.fyStart) }}
              className="flex items-center gap-1 text-[9px] font-sans font-bold uppercase tracking-wider"
              style={{ color: 'var(--accent)' }}
            >
              Try this year in the Sandbox <ChevronRight className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function RiskHorizon() {
  const riskHorizonYears = useAppStore(s => s.riskHorizonYears)
  const setRiskHorizonYears = useAppStore(s => s.setRiskHorizonYears)
  const setDashboardSection = useAppStore(s => s.setDashboardSection)
  const [holdingPeriod, setHoldingPeriod] = useState(riskHorizonYears)

  const handleSliderChange = (v: number) => {
    setHoldingPeriod(v)
    setRiskHorizonYears(v)
  }

  const range = getRangeForPeriod(holdingPeriod)
  const caption = getCaption(holdingPeriod)

  // Color for a bar based on return %
  const getBarColor = (ret: number): string => {
    if (ret < -10) return 'var(--danger)'
    if (ret < 0) return 'rgba(226,75,74,0.35)'
    if (ret < 10) return 'rgba(29,158,117,0.35)'
    return 'var(--teal)'
  }

  // Normalize bars: map return to height (0-100%)
  const maxAbs = Math.max(Math.abs(range.worst), Math.abs(range.best), 1)

  // Build crash annotation map: which start years have crash/recovery indicators
  const crashAnnotations = useMemo(() => {
    const map = new Map<number, { type: 'crash' | 'recovery'; crash: CrashEvent }>()
    for (const crash of CRASH_HISTORY) {
      const startYear = parseInt(crash.startDate.split('-')[1], 10)
      const recoveryYear = parseInt(crash.recoveryDate.split('-')[1], 10)
      // Only annotate if within the chart range
      if (!map.has(startYear)) {
        map.set(startYear, { type: 'crash', crash })
      }
      if (!map.has(recoveryYear) && recoveryYear !== startYear) {
        map.set(recoveryYear, { type: 'recovery', crash })
      }
    }
    return map
  }, [])

  const navigateToSandbox = (_fy: string) => {
    // Navigate to sandbox with this FY (store integration can be extended)
    setDashboardSection('sandbox')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
      className="rounded-3xl p-7 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

      <h3 className="font-display font-semibold text-xl text-white mb-1 tracking-tight">How time dissolves risk</h3>
      <p className="font-sans text-xs text-white/35 mb-8">Drag the slider to see how your maximum possible loss changes with time.</p>

      {/* Slider */}
      <div className="mb-8">
        <label className="font-sans text-[11px] text-white/40 uppercase tracking-wider block mb-2">Holding period</label>
        <p className="font-display font-bold text-4xl mb-3" style={{ color: 'var(--accent)' }}>{holdingPeriod} {holdingPeriod === 1 ? 'year' : 'years'}</p>
        <input
          type="range" min={1} max={15} step={1}
          value={holdingPeriod}
          onChange={e => handleSliderChange(Number(e.target.value))}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: 'var(--accent)', background: 'rgba(255,255,255,0.08)' }}
        />
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[9px] text-white/15">1 year</span>
          <span className="font-mono text-[9px] text-white/15">15 years</span>
        </div>
      </div>

      {/* Band Chart */}
      <div className="rounded-2xl p-4 border mb-6" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
        <div className="flex items-end gap-[2px] h-[160px]">
          {range.entries.map((entry) => {
            const height = Math.abs(entry.returnPct) / maxAbs * 80
            const isNeg = entry.returnPct < 0
            const annotation = crashAnnotations.get(entry.startYear)

            return (
              <motion.div
                key={`${entry.startYear}-${entry.holdingPeriod}`}
                layout
                className="flex-1 flex flex-col justify-end items-center relative group"
                style={{ height: '100%' }}
              >
                {/* Crash / Recovery triangle indicator */}
                {annotation && (
                  <CrashTriangle type={annotation.type} crash={annotation.crash} />
                )}

                {/* Y-axis position: negative bars go down from middle, positive go up */}
                <div className="w-full flex flex-col items-center" style={{ position: 'absolute', bottom: isNeg ? 'auto' : '50%', top: isNeg ? '50%' : 'auto' }}>
                  <motion.div
                    layout
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 2)}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full rounded-sm min-h-[2px]"
                    style={{ background: getBarColor(entry.returnPct) }}
                  />
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 px-1.5 py-0.5 rounded text-[8px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {entry.startYear}: {entry.returnPct > 0 ? '+' : ''}{entry.returnPct}%
                </div>
              </motion.div>
            )
          })}
        </div>
        {/* Zero line */}
        <div className="h-[1px] w-full" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '-80px' }} />
        {/* X axis labels */}
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[8px] text-white/15">{range.entries[0]?.startYear}</span>
          <span className="font-mono text-[8px] text-white/15">{range.entries[range.entries.length - 1]?.startYear}</span>
        </div>
      </div>

      {/* Crash markers timeline */}
      <div className="rounded-2xl p-3 border mb-6" style={{ background: 'rgba(255,255,255,0.01)', borderColor: 'var(--border)' }}>
        <p className="font-sans text-[9px] text-white/20 uppercase tracking-wider mb-3">Historical crashes</p>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-[3px] left-0 right-0 h-[1px]" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="flex justify-between items-start">
            {CRASH_HISTORY.map((crash) => (
              <CrashDot key={crash.name} crash={crash} onNavigate={navigateToSandbox} />
            ))}
          </div>
        </div>
      </div>

      {/* Range summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl p-4 border" style={{ borderColor: range.worst < 0 ? 'rgba(226,75,74,0.15)' : 'rgba(29,158,117,0.15)', background: 'var(--surface)' }}>
          <p className="text-[9px] font-sans text-white/25 uppercase mb-1">Worst case</p>
          <p className="font-display font-semibold text-lg" style={{ color: range.worst < 0 ? 'var(--danger)' : 'var(--teal)' }}>
            {range.worst > 0 ? '+' : ''}{range.worst.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-2xl p-4 border" style={{ borderColor: 'rgba(29,158,117,0.15)', background: 'var(--surface)' }}>
          <p className="text-[9px] font-sans text-white/25 uppercase mb-1">Best case</p>
          <p className="font-display font-semibold text-lg" style={{ color: 'var(--teal)' }}>+{range.best.toFixed(1)}%</p>
        </div>
      </div>

      {/* Dynamic Caption */}
      <p className="font-sans text-sm text-white/55 leading-relaxed mb-6">{caption}</p>

      {/* Disclaimer — body-size, never fine print */}
      <p className="font-sans text-sm text-white/40 leading-relaxed">
        Based on Nifty 50 historical data 2001–2024. Past performance does not guarantee future returns.
        This reflects index fund behaviour only. Individual stocks behave very differently.
      </p>
    </motion.div>
  )
}
