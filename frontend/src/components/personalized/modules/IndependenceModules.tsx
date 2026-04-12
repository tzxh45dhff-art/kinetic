import { motion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Lock, ArrowRight, Users, Calculator, BarChart3, Zap } from 'lucide-react'
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

// ── Module 1: The No-Human Portfolio ────────────────────────────────────────

function NoHumanPortfolio() {
  // CSS-animated company logos flowing into a fund container
  const companies = [
    'RELIANCE', 'TCS', 'HDFC', 'INFY', 'ICICI',
    'HUL', 'ITC', 'SBI', 'BAJAJ', 'KOTAK',
    'BHARTI', 'ASIAN P', 'L&T', 'MARUTI', 'TITAN',
  ]

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
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(29,158,117,0.12)' }}>
          <Lock className="w-4 h-4" style={{ color: '#1D9E75' }} />
        </div>
        <h3 className="font-display text-lg text-white font-medium tracking-tight">The No-Human Portfolio</h3>
      </div>

      <p className="font-sans text-sm text-white/55 leading-relaxed mb-6">
        An index fund just copies the top 50 companies.
        No fund manager. No human decisions. No one to trust or distrust.
      </p>

      {/* Animated company flow visualization */}
      <div className="relative overflow-hidden rounded-2xl p-5 border mb-6" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex flex-wrap gap-2 mb-4">
          {companies.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, scale: 0.5, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 300, damping: 20 }}
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono border"
              style={{ background: 'rgba(29,158,117,0.06)', borderColor: 'rgba(29,158,117,0.12)', color: '#1D9E75' }}
            >
              {company}
            </motion.div>
          ))}
        </div>

        {/* Arrow flow */}
        <div className="flex items-center justify-center gap-3 my-3">
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-5 h-5 text-white/20" />
          </motion.div>
        </div>

        {/* Fund result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="rounded-xl p-4 border text-center"
          style={{ background: 'rgba(29,158,117,0.06)', borderColor: 'rgba(29,158,117,0.15)' }}
        >
          <p className="font-display text-sm text-white font-medium">Nifty 50 Index Fund</p>
          <p className="font-sans text-[10px] text-white/35 mt-1">50 companies, zero human decisions</p>
        </motion.div>
      </div>

      <button className="flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.15em] text-[var(--color-primary-fixed)] uppercase">
        See how it's performed <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  )
}

// ── Module 2: Fund Manager vs Index ─────────────────────────────────────────

function FundManagerVsIndex() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Active fund */}
        <div
          className="rounded-3xl p-6 border"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-white/40" />
            <p className="font-display text-sm text-white/80 font-medium">Actively Managed</p>
          </div>
          <ul className="space-y-2.5">
            <li className="font-sans text-xs text-white/50 leading-relaxed">Fund manager picks stocks</li>
            <li className="font-sans text-xs text-white/50 leading-relaxed">Higher fees (1.5–2.5% expense ratio)</li>
            <li className="font-sans text-xs leading-relaxed" style={{ color: '#E24B4A' }}>80% underperform the index over 10 years</li>
          </ul>
        </div>

        {/* Index fund */}
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
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" style={{ color: '#EF9F27' }} />
            <p className="font-display text-sm font-medium" style={{ color: '#EF9F27' }}>Nifty 50 Index Fund</p>
          </div>
          <ul className="space-y-2.5">
            <li className="font-sans text-xs text-white/50 leading-relaxed">Copies the market, no human picks</li>
            <li className="font-sans text-xs text-white/50 leading-relaxed">Low fees (0.1–0.2% expense ratio)</li>
            <li className="font-sans text-xs leading-relaxed" style={{ color: '#1D9E75' }}>Beats most fund managers over 10 years</li>
          </ul>
        </div>
      </div>

      <p className="font-sans text-[10px] text-white/25 mt-4 text-center">
        Source: SPIVA India Report 2023
      </p>
    </motion.div>
  )
}

// ── Module 3: Fee Erosion Calculator ────────────────────────────────────────

function FeeErosionCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [years, setYears] = useState(10)

  const rate = 0.12 // 12% base return
  const months = years * 12

  // High expense ratio (2%)
  const highFeeRate = (rate - 0.02) / 12
  const highFeeFV = monthly * ((Math.pow(1 + highFeeRate, months) - 1) / highFeeRate) * (1 + highFeeRate)

  // Low expense ratio (0.1%)
  const lowFeeRate = (rate - 0.001) / 12
  const lowFeeFV = monthly * ((Math.pow(1 + lowFeeRate, months) - 1) / lowFeeRate) * (1 + lowFeeRate)

  const feeLoss = lowFeeFV - highFeeFV

  const feeLossDisplay = useAnimatedCounter(Math.round(feeLoss))
  const keepMoreDisplay = useAnimatedCounter(Math.round(lowFeeFV))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      className="rounded-3xl p-7 border"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(192,241,142,0.10)' }}>
          <Calculator className="w-4 h-4" style={{ color: '#EF9F27' }} />
        </div>
        <h3 className="font-display text-base text-white font-medium tracking-tight">Fee Erosion Calculator</h3>
      </div>

      <div className="space-y-5 mb-6">
        {/* Monthly slider */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-[11px] font-sans text-white/45">Monthly Investment</span>
            <span className="text-sm font-display text-white font-semibold">{formatINR(monthly)}</span>
          </div>
          <input
            type="range" min={500} max={10000} step={500}
            value={monthly} onChange={e => setMonthly(+e.target.value)}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#c0f18e]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] font-mono text-white/25">₹500</span>
            <span className="text-[9px] font-mono text-white/25">₹10,000</span>
          </div>
        </div>

        {/* Years slider */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-[11px] font-sans text-white/45">Years</span>
            <span className="text-sm font-display text-white font-semibold">{years} years</span>
          </div>
          <input
            type="range" min={5} max={20} step={1}
            value={years} onChange={e => setYears(+e.target.value)}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#c0f18e]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] font-mono text-white/25">5 yrs</span>
            <span className="text-[9px] font-mono text-white/25">20 yrs</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(226,75,74,0.04)', borderColor: 'rgba(226,75,74,0.12)' }}>
          <p className="text-[9px] font-sans tracking-wider uppercase mb-1" style={{ color: '#E24B4A' }}>Lost to 2% fees</p>
          <p className="font-display text-lg font-semibold" style={{ color: '#E24B4A' }}>{formatINR(feeLossDisplay)}</p>
        </div>
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(29,158,117,0.04)', borderColor: 'rgba(29,158,117,0.12)' }}>
          <p className="text-[9px] font-sans tracking-wider uppercase mb-1" style={{ color: '#1D9E75' }}>Kept at 0.1%</p>
          <p className="font-display text-lg font-semibold" style={{ color: '#1D9E75' }}>{formatINR(keepMoreDisplay)}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ── Module 4: The Math, Not The Man ─────────────────────────────────────────

function TheMathNotTheMan() {
  // Simplified GDP growth + Nifty returns
  const data = [
    { year: '2015', gdp: 8.0, nifty: 7.4 },
    { year: '2016', gdp: 8.3, nifty: 3.0 },
    { year: '2017', gdp: 6.8, nifty: 28.6 },
    { year: '2018', gdp: 6.5, nifty: 3.2 },
    { year: '2019', gdp: 3.9, nifty: 12.0 },
    { year: '2020', gdp: -6.6, nifty: 14.9 },
    { year: '2021', gdp: 9.7, nifty: 24.1 },
    { year: '2022', gdp: 7.0, nifty: 4.3 },
    { year: '2023', gdp: 7.6, nifty: 20.0 },
  ]

  const maxNifty = Math.max(...data.map(d => d.nifty))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      className="rounded-3xl p-7 border"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <h3 className="font-display text-base text-white font-medium tracking-tight mb-3">The Math, Not The Man</h3>
      <p className="font-sans text-xs text-white/45 mb-6 leading-relaxed">
        The index goes up because India's economy grows. Not because someone made a good decision.
      </p>

      {/* Simplified bar chart — Nifty returns */}
      <div className="flex items-end gap-2 h-24 mb-3">
        {data.map((d, i) => (
          <motion.div
            key={d.year}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(8, (d.nifty / maxNifty) * 100)}%` }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
            className="flex-1 rounded-t-md"
            style={{
              background: d.nifty >= 0 ? 'rgba(29,158,117,0.5)' : 'rgba(226,75,74,0.5)',
              minHeight: 4,
            }}
            title={`${d.year}: Nifty ${d.nifty}%`}
          />
        ))}
      </div>

      <div className="flex items-end gap-2 mb-4">
        {data.map(d => (
          <span key={d.year} className="flex-1 text-center text-[8px] font-mono text-white/20">
            {d.year.slice(2)}
          </span>
        ))}
      </div>

      <p className="font-sans text-xs text-white/40 leading-relaxed text-center">
        You're not trusting a person. You're trusting India.
      </p>
    </motion.div>
  )
}

// ── Module 5: Today's Micro Action ──────────────────────────────────────────

function TodaysMicroAction() {
  const completeModule = useAppStore(s => s.completeModule)
  const completedModules = useAppStore(s => s.completedModules)

  const actions = [
    { id: 'trust-micro-1', text: 'Compare: Nifty 50 index fund vs top active fund over 10 years' },
    { id: 'trust-micro-2', text: 'Calculate: How much fees will cost you over 20 years' },
    { id: 'trust-micro-3', text: 'Read: Why Warren Buffett recommends index funds for most people' },
  ]

  const dayIndex = new Date().getDate() % actions.length
  const action = actions[dayIndex]
  const isCompleted = completedModules.includes(action.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
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

      <p className="font-sans text-sm text-white/60 leading-relaxed mb-4">{action.text}</p>

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

export default function IndependenceModules() {
  return (
    <div className="space-y-5">
      <NoHumanPortfolio />
      <FundManagerVsIndex />
      <FeeErosionCalculator />
      <TheMathNotTheMan />
      <TodaysMicroAction />
    </div>
  )
}
