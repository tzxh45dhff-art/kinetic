import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAppStore, type FearType } from '../../store/useAppStore'
import {
  Target, BookOpen, TrendingUp, Shield, Play, ArrowRight, Sparkles, Calculator,
  ChevronRight, Eye, Zap, Lock
} from 'lucide-react'

// ── Fear type styling ─────────────────────────────────────────────────────────

const FEAR_PROFILES: Record<FearType, {
  name: string; color: string; bg: string; icon: typeof Shield
  lesson1: string; lesson2: string; lesson3: string
}> = {
  loss: {
    name: 'Loss Avoider',
    color: '#E24B4A',
    bg: 'rgba(226,75,74,0.08)',
    icon: Shield,
    lesson1: 'Why markets always recover — 100 years of data',
    lesson2: 'The real cost of NOT investing (inflation burns ₹54K/year)',
    lesson3: 'How SIPs protect you from timing mistakes',
  },
  jargon: {
    name: 'Clarity Seeker',
    color: '#378ADD',
    bg: 'rgba(55,138,221,0.08)',
    icon: BookOpen,
    lesson1: 'Mutual funds in 60 seconds — no jargon, just facts',
    lesson2: 'SIP vs. Lumpsum: when to use which (simple flowchart)',
    lesson3: 'NAV, CAGR, Expense Ratio — the only 3 terms that matter',
  },
  scam: {
    name: 'Pattern Detector',
    color: '#EF9F27',
    bg: 'rgba(239,159,39,0.08)',
    icon: Eye,
    lesson1: 'SEBI regulation: how your money is actually protected',
    lesson2: '5 red flags of a real scam vs. legitimate investing',
    lesson3: 'Index funds: no human manager to trust or doubt',
  },
  trust: {
    name: 'Independence Guardian',
    color: '#1D9E75',
    bg: 'rgba(29,158,117,0.08)',
    icon: Lock,
    lesson1: 'Index funds don\'t need a fund manager — just math',
    lesson2: 'How to verify everything yourself (RTAs, NAV sources)',
    lesson3: 'Direct plans: cut out every middleman',
  },
}

// ── SIP Calculator ────────────────────────────────────────────────────────────

function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [years, setYears] = useState(10)
  const rate = 0.12 // 12% annual

  const months = years * 12
  const monthlyRate = rate / 12
  const futureValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  const totalInvested = monthly * months
  const returns = futureValue - totalInvested

  function formatINR(n: number) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
    return `₹${Math.round(n).toLocaleString('en-IN')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' as const }}
      className="bg-[#071a1f] border border-white/[0.06] rounded-3xl p-7 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-2xl bg-[var(--color-primary-fixed)]/10 border border-[var(--color-primary-fixed)]/15 flex items-center justify-center">
          <Calculator className="w-4 h-4 text-[var(--color-primary-fixed)]" />
        </div>
        <h3 className="font-display text-lg text-white font-medium tracking-tight">SIP Calculator</h3>
      </div>

      <div className="space-y-6">
        {/* Monthly amount */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-[11px] font-sans text-white/45 tracking-wide">Monthly Investment</span>
            <span className="text-sm font-display text-white font-semibold">{formatINR(monthly)}</span>
          </div>
          <input
            type="range"
            min={500} max={50000} step={500}
            value={monthly}
            onChange={e => setMonthly(+e.target.value)}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#c0f18e]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] font-mono text-white/25">₹500</span>
            <span className="text-[9px] font-mono text-white/25">₹50,000</span>
          </div>
        </div>

        {/* Years */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-[11px] font-sans text-white/45 tracking-wide">Investment Period</span>
            <span className="text-sm font-display text-white font-semibold">{years} years</span>
          </div>
          <input
            type="range"
            min={1} max={30} step={1}
            value={years}
            onChange={e => setYears(+e.target.value)}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#c0f18e]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] font-mono text-white/25">1 yr</span>
            <span className="text-[9px] font-mono text-white/25">30 yrs</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
          <div>
            <p className="text-[9px] font-sans text-white/35 tracking-wider uppercase mb-1">Invested</p>
            <p className="font-display text-base text-white font-semibold">{formatINR(totalInvested)}</p>
          </div>
          <div>
            <p className="text-[9px] font-sans text-white/35 tracking-wider uppercase mb-1">Returns</p>
            <p className="font-display text-base text-[var(--color-primary-fixed)] font-semibold">{formatINR(returns)}</p>
          </div>
          <div>
            <p className="text-[9px] font-sans text-white/35 tracking-wider uppercase mb-1">Total Value</p>
            <p className="font-display text-base text-white font-semibold">{formatINR(futureValue)}</p>
          </div>
        </div>

        {/* Visual bar */}
        <div className="h-6 rounded-full overflow-hidden flex bg-white/[0.05] relative">
          <motion.div
            animate={{ width: `${(totalInvested / futureValue) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-white/15 rounded-l-full"
          />
          <motion.div
            animate={{ width: `${(returns / futureValue) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[var(--color-primary-fixed)]/40 rounded-r-full"
          />
        </div>
        <div className="flex gap-4 text-[9px] font-sans text-white/35">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/15"></span> Invested</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--color-primary-fixed)]/40"></span> Returns</span>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main Onboarding Dashboard ─────────────────────────────────────────────────

export default function OnboardingDashboard() {
  const fearType = useAppStore(s => s.fearType)
  const profile = fearType ? FEAR_PROFILES[fearType] : FEAR_PROFILES.loss
  const FearIcon = profile.icon

  const journeySteps = [
    {
      step: '01',
      title: 'Understand Your Fear',
      desc: 'You just did this — your fear type shapes your entire journey with us.',
      done: true,
      icon: <Target className="w-4 h-4" />,
    },
    {
      step: '02',
      title: 'Learn the Basics',
      desc: 'Three 5-minute lessons, written just for your fear type. No jargon.',
      done: false,
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      step: '03',
      title: 'Start with ₹500',
      desc: 'Your first SIP. Small enough to feel safe. Big enough to start compounding.',
      done: false,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      step: '04',
      title: 'Build Your Shield',
      desc: 'Automate your investments so fear never gets to decide for you.',
      done: false,
      icon: <Shield className="w-4 h-4" />,
    },
  ]

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 pb-24 space-y-6"
    >
      {/* ── Welcome Section ──────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display font-medium text-3xl md:text-4xl text-white mb-2 leading-tight">
            Welcome to Kinetic
          </h1>
          <p className="font-sans text-white/50 text-sm md:text-base">
            Your investment journey starts here. Let's turn fear into confidence.
          </p>
        </motion.div>

        {/* Fear type badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl px-5 py-4 flex items-center gap-3 border"
          style={{ background: profile.bg, borderColor: `${profile.color}25` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${profile.color}20` }}
          >
            <FearIcon className="w-4 h-4" style={{ color: profile.color }} />
          </div>
          <div>
            <p className="text-[10px] font-sans font-bold tracking-widest uppercase mb-0.5" style={{ color: profile.color }}>
              Your Fear Type
            </p>
            <p className="text-sm font-display font-semibold text-white">{profile.name}</p>
          </div>
        </motion.div>
      </div>

      {/* ── Journey Steps ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' as const }}
        className="bg-[#071a1f] border border-white/[0.06] rounded-3xl overflow-hidden"
      >
        <div className="px-7 md:px-8 py-6 border-b border-white/[0.04] flex items-center gap-3">
          <Play className="w-4 h-4 text-[var(--color-primary-fixed)]" />
          <h2 className="font-display text-lg text-white font-medium tracking-tight">Your Journey</h2>
          <span className="ml-auto text-[10px] font-mono text-white/25">1/4 complete</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4">
          {journeySteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: 'easeOut' as const }}
              className={`p-7 ${i < 3 ? 'md:border-r border-white/[0.04]' : ''} ${step.done ? '' : 'opacity-80'} hover:bg-white/[0.02] transition-colors group`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  step.done
                    ? 'bg-[var(--color-primary-fixed)]/15 text-[var(--color-primary-fixed)]'
                    : 'bg-white/[0.04] text-white/30'
                }`}>
                  {step.icon}
                </div>
                <span className="font-display italic text-sm font-semibold text-white/25">{step.step}</span>
              </div>
              <h4 className={`font-display text-base font-medium mb-2 tracking-tight ${step.done ? 'text-white' : 'text-white/75'}`}>
                {step.title}
              </h4>
              <p className="font-sans text-[12px] text-white/40 leading-relaxed mb-4">{step.desc}</p>
              {step.done ? (
                <span className="text-[9px] font-sans font-bold tracking-[0.15em] text-[var(--color-primary-fixed)] uppercase">✓ Complete</span>
              ) : (
                <button className="flex items-center gap-1.5 text-[9px] font-sans font-bold tracking-[0.15em] text-white/35 uppercase group-hover:text-white/60 transition-colors">
                  Start <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Two Column: Lessons + SIP Calc ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Lessons tailored to fear type */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' as const }}
          className="bg-[#071a1f] border border-white/[0.06] rounded-3xl p-7 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: `${profile.color}15` }}>
              <BookOpen className="w-4 h-4" style={{ color: profile.color }} />
            </div>
            <div>
              <h3 className="font-display text-lg text-white font-medium tracking-tight">Lessons for You</h3>
              <p className="text-[10px] font-sans text-white/35">Tailored for {profile.name}s</p>
            </div>
          </div>

          <div className="space-y-3">
            {[profile.lesson1, profile.lesson2, profile.lesson3].map((lesson, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-200 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[11px] font-display italic font-semibold text-white/30">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1">
                  <p className="font-sans text-sm text-white/75 leading-relaxed group-hover:text-white/90 transition-colors">{lesson}</p>
                  <p className="text-[9px] font-sans text-white/25 mt-2">5 min read</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/40 shrink-0 mt-1 transition-colors" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SIP Calculator */}
        <SIPCalculator />
      </div>

      {/* ── Bottom Row: AI Card + Quick Actions ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* AI Mentor Card (lime inverse) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' as const }}
          className="bg-[#c0f18e] rounded-3xl p-7 flex flex-col justify-between min-h-[260px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/25 rounded-full blur-2xl" />
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#0a2000]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0a2000]" />
              </div>
              <span className="bg-[#0a2000]/10 text-[#0a2000] text-[8px] font-black tracking-[0.2em] px-2.5 py-1 rounded-md">
                AI MENTOR
              </span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#061000] mb-4 tracking-tight">
              Your Personal Guide
            </h3>
            <div className="border-l-[2px] border-[#0a2000]/20 pl-4">
              <p className="font-sans text-[13px] text-[#0a2000]/75 leading-relaxed font-medium">
                "As a {profile.name}, your biggest edge is caution. Let me show you how to keep that edge while actually growing your money."
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#0a2000]/15">
            <span className="text-[9px] font-sans font-black tracking-[0.15em] text-[#0a2000]/55 uppercase">
              Ask anything
            </span>
            <Zap className="w-4 h-4 text-[#0a2000]/55" />
          </div>
        </motion.div>

        {/* Quick Start Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' as const }}
          className="bg-[#071a1f] border border-white/[0.06] hover:border-white/10 transition-colors rounded-3xl p-7 flex flex-col justify-between min-h-[260px] group cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center mb-6">
              <TrendingUp className="w-5 h-5 text-[#c0f18e]" />
            </div>
            <h3 className="font-display text-xl text-white font-medium mb-3 tracking-tight">Start Your First SIP</h3>
            <p className="font-sans text-[13px] text-white/40 leading-relaxed">
              Begin with as little as ₹500/month. Automate it and forget — time does the heavy lifting.
            </p>
          </div>
          <div className="flex items-center text-[9px] font-sans font-black tracking-[0.2em] text-[#c0f18e] mt-6 uppercase">
            Begin Now
            <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>
        </motion.div>

        {/* Explore Markets Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' as const }}
          className="bg-[#071a1f] border border-white/[0.06] hover:border-white/10 transition-colors rounded-3xl p-7 flex flex-col justify-between min-h-[260px] group cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center mb-6">
              <Eye className="w-5 h-5 text-[#c0f18e]" />
            </div>
            <h3 className="font-display text-xl text-white font-medium mb-3 tracking-tight">Explore Markets</h3>
            <p className="font-sans text-[13px] text-white/40 leading-relaxed">
              Watch real market data without investing a rupee. Get comfortable seeing numbers move.
            </p>
          </div>
          <div className="flex items-center text-[9px] font-sans font-black tracking-[0.2em] text-[#c0f18e] mt-6 uppercase">
            Open Markets
            <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
