import { motion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Shield, TrendingDown, TrendingUp, ArrowRight, Zap } from 'lucide-react'
import { useAppStore } from '../../../store/useAppStore'

// ── Animated counter hook ────────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1.5) {
  const motionVal = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const ctrl = animate(motionVal, target, { duration, ease: 'easeOut' })
    const unsub = motionVal.on('change', v => setDisplay(Math.round(v)))
    return () => { ctrl.stop(); unsub() }
  }, [target, duration, motionVal])

  return display
}

function formatINR(val: number): string {
  if (val >= 1e7) return `₹${(val / 1e7).toFixed(2)} Cr`
  if (val >= 1e5) return `₹${(val / 1e5).toFixed(2)} L`
  return `₹${Math.round(val).toLocaleString('en-IN')}`
}

// ── Sparkline component ─────────────────────────────────────────────────────

function MiniSparkline() {
  // Simplified ₹500/mo SIP from 2015–2024 journey with COVID dip
  const dataPoints = [
    6, 12, 18, 25, 33, 42, 50, 58, 65, 72, // 2015-2017 growth
    78, 85, 91, 96, 100, 105, 110, 114,     // 2018-early 2019
    118, 122, 125, 128, 130,                 // mid 2019
    80, 72, 68,                              // COVID crash (dip)
    85, 105, 125, 140, 155, 165, 175, 182   // recovery to 2024
  ]
  const maxVal = Math.max(...dataPoints)
  const covidStart = 23
  const covidEnd = 25

  const width = 280
  const height = 60
  const step = width / (dataPoints.length - 1)

  const points = dataPoints.map((v, i) => ({
    x: i * step,
    y: height - (v / maxVal) * (height - 8) - 4,
  }))

  // Build path segments
  let normalPath = ''
  let dangerPath = ''
  let recoveryPath = ''

  points.forEach((pt, i) => {
    const cmd = i === 0 ? 'M' : 'L'
    if (i < covidStart) {
      normalPath += `${cmd}${pt.x},${pt.y} `
    } else if (i >= covidStart && i <= covidEnd) {
      if (i === covidStart) {
        dangerPath += `M${points[covidStart - 1].x},${points[covidStart - 1].y} `
      }
      dangerPath += `L${pt.x},${pt.y} `
    } else {
      if (i === covidEnd + 1) {
        recoveryPath += `M${points[covidEnd].x},${points[covidEnd].y} `
      }
      recoveryPath += `L${pt.x},${pt.y} `
    }
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 mt-4">
      <path d={normalPath} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
      <path d={dangerPath} fill="none" stroke="#E24B4A" strokeWidth="2" strokeLinecap="round" />
      <path d={recoveryPath} fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── Module 1: Worst Case Survival ───────────────────────────────────────────

function WorstCaseSurvival() {
  const investedCount = useAnimatedCounter(54000)
  const valueCount = useAnimatedCounter(182000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-3xl p-7 md:p-8 border"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(226,75,74,0.12)' }}>
          <Shield className="w-4 h-4" style={{ color: '#E24B4A' }} />
        </div>
        <h3 className="font-display text-lg text-white font-medium tracking-tight">Worst Case Survival</h3>
      </div>

      <p className="font-sans text-sm text-white/50 mb-6 leading-relaxed">
        If you had invested ₹500/month since 2015...
      </p>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-[9px] font-sans text-white/35 tracking-wider uppercase mb-1">Total Invested</p>
          <p className="font-display text-xl text-white font-semibold">{formatINR(investedCount)}</p>
        </div>
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(29,158,117,0.06)', borderColor: 'rgba(29,158,117,0.15)' }}>
          <p className="text-[9px] font-sans tracking-wider uppercase mb-1" style={{ color: '#1D9E75' }}>Value Today</p>
          <p className="font-display text-xl font-semibold" style={{ color: '#1D9E75' }}>{formatINR(valueCount)}</p>
        </div>
      </div>

      <MiniSparkline />

      <p className="font-sans text-xs text-white/40 mt-4 leading-relaxed">
        Even through COVID, your money survived and grew.
      </p>

      <button className="mt-5 flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.15em] text-[var(--color-primary-fixed)] uppercase">
        See the full simulation <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  )
}

// ── Module 2: Crash Survival Record ─────────────────────────────────────────

function CrashSurvivalRecord() {
  const crashes = [
    { year: '2008', drop: '-52%', recovery: '18 months' },
    { year: '2015', drop: '-23%', recovery: '8 months' },
    { year: '2020', drop: '-38%', recovery: '6 months' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      className="rounded-3xl p-7 border"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <h3 className="font-display text-lg text-white font-medium tracking-tight mb-5">The Crash Survival Record</h3>

      <div className="space-y-3">
        {crashes.map((crash, i) => (
          <motion.div
            key={crash.year}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            className="flex items-center justify-between p-4 rounded-2xl border"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <span className="font-display text-sm text-white font-medium w-12">{crash.year}</span>
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" style={{ color: '#E24B4A' }} />
              <span className="font-mono text-xs" style={{ color: '#E24B4A' }}>{crash.drop}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: '#1D9E75' }} />
              <span className="font-mono text-xs" style={{ color: '#1D9E75' }}>recovered in {crash.recovery}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="font-sans text-xs text-white/40 mt-5 leading-relaxed">
        Every single crash in 20 years. Every one recovered.
      </p>
    </motion.div>
  )
}

// ── Module 3: Rupee Reality Check ───────────────────────────────────────────

function RupeeRealityCheck() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="rounded-3xl p-6 border"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-[9px] font-sans text-white/35 tracking-wider uppercase mb-2">Savings Account</p>
          <p className="font-display text-2xl text-white font-bold mb-1">₹500</p>
          <p className="font-sans text-xs text-white/40">in savings for 10 years = ₹500</p>
        </div>

        <div
          className="rounded-3xl p-6 border"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: 'rgba(255,255,255,0.08)',
            borderLeft: '3px solid #EF9F27',
          }}
        >
          <p className="text-[9px] font-sans tracking-wider uppercase mb-2" style={{ color: '#EF9F27' }}>SIP Investment</p>
          <p className="font-display text-2xl font-bold mb-1" style={{ color: '#EF9F27' }}>₹1.17L</p>
          <p className="font-sans text-xs text-white/40">₹500/month SIP for 10 years</p>
        </div>
      </div>

      <p className="font-sans text-xs text-white/40 mt-4 text-center leading-relaxed">
        The actual risk is not investing.
      </p>
    </motion.div>
  )
}

// ── Module 4: Today's Micro Action ──────────────────────────────────────────

function TodaysMicroAction() {
  const completeModule = useAppStore(s => s.completeModule)
  const completedModules = useAppStore(s => s.completedModules)

  const actions = [
    { id: 'loss-micro-1', text: 'Run the ₹500 Time Machine and watch the COVID crash recover' },
    { id: 'loss-micro-2', text: 'See what ₹100/month would have become since 2018' },
    { id: 'loss-micro-3', text: "Read: Why SIPs survive crashes that lump sums don't" },
  ]

  // Rotate daily
  const dayIndex = new Date().getDate() % actions.length
  const action = actions[dayIndex]
  const isCompleted = completedModules.includes(action.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      className="rounded-3xl p-6 border"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(192,241,142,0.10)' }}>
          <Zap className="w-4 h-4" style={{ color: '#EF9F27' }} />
        </div>
        <h3 className="font-display text-sm text-white font-medium">Today's Micro Action</h3>
      </div>

      <p className="font-sans text-sm text-white/60 leading-relaxed mb-4">
        {action.text}
      </p>

      <button
        onClick={() => !isCompleted && completeModule(action.id)}
        disabled={isCompleted}
        className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase transition-all duration-200"
        style={{
          color: isCompleted ? '#1D9E75' : 'var(--color-primary-fixed)',
          opacity: isCompleted ? 0.7 : 1,
        }}
      >
        {isCompleted ? '✓ Completed' : 'Mark as done'}
      </button>
    </motion.div>
  )
}

// ── Export ───────────────────────────────────────────────────────────────────

export default function LossModules() {
  return (
    <div className="space-y-5">
      <WorstCaseSurvival />
      <CrashSurvivalRecord />
      <RupeeRealityCheck />
      <TodaysMicroAction />
    </div>
  )
}
