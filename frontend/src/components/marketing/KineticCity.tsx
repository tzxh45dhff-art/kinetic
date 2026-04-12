import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import './kinetic-city.css'

/* ─────────────────────────────────────────────────────────────────────────────
   Design tokens — exact values from index.css, no new colours
   ───────────────────────────────────────────────────────────────────────────── */
const C = {
  bg:         '#00161b',
  // Building faces — minimum 3 brightness levels above bg
  surfHover:  'rgba(255,255,255,0.07)',   // --surface-hover
  surfBright: 'rgba(255,255,255,0.10)',   // brightest building (Index Temple)
  surfBase:   'rgba(255,255,255,0.04)',   // --surface (FD Vault — dullest)
  surfFear:   'rgba(255,255,255,0.055)',  // Fear Tower — dim but visible
  border:     'rgba(255,255,255,0.08)',
  borderBrt:  'rgba(255,255,255,0.16)',
  accent:     '#c0f18e',
  danger:     '#E24B4A',
  teal:       '#1D9E75',
  blue:       '#378ADD',
  amber:      '#d4a853',
  txtHi:      'rgba(255,255,255,0.92)',
  txtMd:      'rgba(255,255,255,0.60)',
  txtLo:      'rgba(255,255,255,0.35)',
  ground:     'rgba(255,255,255,0.03)',   // ground surface
  road:       'rgba(255,255,255,0.09)',   // road — clearly brighter than ground
}

/* ── Ticker ────────────────────────────────────────────────────────────────── */
const TICKER = 'NIFTY 50  24,198  ▲1.2%   ·   SENSEX  79,442  ▲0.8%   ·   MIDCAP  11,024  ▲2.1%   ·   SMALLCAP  8,847  ▲3.4%   ·   GOLD  ₹7,842/g  ▲0.3%   ·   USD/INR  83.42  ▼0.1%   ·   10Y BOND  7.1%  ─0.0%   ·   '

function TickerContent() {
  // Colorize: teal for ▲, danger for ▼, txtHi for numbers, txtMd for labels
  const parts = TICKER.split(/(▲\S+|▼\S+|─\S+)/)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('▲')) return <span key={i} style={{ color: C.teal }}>{p}</span>
        if (p.startsWith('▼')) return <span key={i} style={{ color: C.danger }}>{p}</span>
        if (p.startsWith('─')) return <span key={i} style={{ color: C.txtMd }}>{p}</span>
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

/* ── Hooks ─────────────────────────────────────────────────────────────────── */

function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12
      setTime(`${h}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')} ${ap}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function useFearPct() {
  const [v, setV] = useState(-1.2)
  useEffect(() => {
    const s = [-1.2,-1.5,-1.8,-2.1,-2.4]; let i = 0
    const id = setInterval(() => { i = (i+1)%s.length; setV(s[i]) }, 1600)
    return () => clearInterval(id)
  }, [])
  return v.toFixed(1)
}

function useSipCounter() {
  const mv = useMotionValue(0)
  const [d, setD] = useState('₹0')
  useEffect(() => {
    const ctrl = animate(mv, 120000, { duration: 40, ease: 'linear', repeat: Infinity, repeatType: 'loop' as const })
    const unsub = mv.on('change', v => setD(`₹${(Math.round(v/500)*500).toLocaleString('en-IN')}`))
    return () => { ctrl.stop(); unsub() }
  }, [mv])
  return d
}

/* ── Icons for fear cards (16px, 1px stroke) ──────────────────────────────── */
const ShieldIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const FpIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-3.5 2.5-6 6-6s6 2.5 6 6c0 1.5-.5 3-1 4"/></svg>
const UnlockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>

/* ── Building entrance spring (slowed: 800ms feel) ────────────────────────── */
const rise = { type: 'spring' as const, stiffness: 180, damping: 18, mass: 1.0 }

/* ═══════════════════════════════════════════════════════════════════════════ */

interface Props { onStart: () => void }

export default function KineticCity({ onStart }: Props) {
  const [pulse, setPulse] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const clock = useClock()
  const fearPct = useFearPct()
  const sipCount = useSipCounter()

  // Pause CSS anims when tab hidden
  useEffect(() => {
    const h = () => {
      const s = document.hidden ? 'paused' : 'running'
      document.querySelectorAll('.kinetic-anim').forEach(el => {
        ;(el as HTMLElement).style.animationPlayState = s
      })
    }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [])

  // Hero stays visible — no scroll-based fade or parallax
  // It scrolls off naturally as the user scrolls past 100vh

  // CTA click → brief flash → navigate
  const handleCTA = useCallback(() => {
    if (pulse) return // prevent double-fire
    setPulse(true)
    onStart() // navigate immediately
    setTimeout(() => setPulse(false), 150)
  }, [onStart, pulse])

  /* ── Entrance timing (slowed per spec) ────────────────────────────────── */
  const D = {
    ground: 0.2,
    roads:  0.6,
    b: (i: number) => 1.0 + i * 0.18,   // 180ms stagger
    trees:  2.2,
    ticker: 2.6,
    card: (i: number) => 3.2 + i * 0.15, // fear cards delayed to 3200ms
    letter: (i: number) => 2.8 + i * 0.06,
    sub:    3.5,
    italic: 3.7,
    cta:    4.1,
    fine:   4.25,
  }

  const GY = 390     // street level
  const title = 'KINETIC'

  /* ── Fear card data (positioned above their building in SVG space) ────── */
  const fearCards = [
    { label: 'Loss Avoider',          Icon: ShieldIcon, color: C.danger, x: 140, y: GY - 250 },
    { label: 'Clarity Seeker',        Icon: SearchIcon, color: C.blue,   x: 770, y: GY - 235 },
    { label: 'Pattern Detector',      Icon: FpIcon,     color: C.accent, x: 35,  y: GY - 85 },
    { label: 'Independence Guardian', Icon: UnlockIcon, color: C.teal,   x: 590, y: GY - 150 },
  ]

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
      {/* ── Gradient overlay: clean dark space for headline (top 40%) ──── */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{ height: '45%', background: 'linear-gradient(to bottom, #00161b 20%, transparent 100%)' }}
      />

      {/* ════════════ HEADLINE LAYER (z-30, above gradient) ════════════ */}
      <div className="absolute inset-0 z-30 flex flex-col items-center pt-[9vh] md:pt-[11vh] pointer-events-none">
        {/* "KINETIC" letter-by-letter */}
        <div className="flex items-center gap-[2px] md:gap-1 mb-3">
          {title.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: D.letter(i), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-5xl md:text-[5.5rem] leading-none select-none"
              style={{ color: C.accent, letterSpacing: '0.12em', textShadow: '0 0 40px rgba(192,241,142,0.3)' }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D.sub, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-medium text-lg md:text-2xl mb-2 select-none"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Face the fear. Start with ₹500.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: D.italic, duration: 0.4 }}
          className="font-sans text-[11px] md:text-sm italic mb-5 select-none"
          style={{ color: C.txtLo }}
        >
          One of these four is yours.
        </motion.p>

        {/* CTA Button — pointer-events enabled, z above everything */}
        <motion.button
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: D.cta, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={handleCTA}
          className="pointer-events-auto relative z-50 inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-display font-bold text-sm md:text-base cursor-pointer active:scale-[0.97] transition-transform duration-200 box-glow"
          style={{ background: C.accent, color: '#0a1a00' }}
        >
          Find my fear type <ArrowRight className="w-4 h-4" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: D.fine, duration: 0.35 }}
          className="font-sans text-[9px] md:text-[10px] mt-3 tracking-[0.12em] select-none"
          style={{ color: C.txtLo }}
        >
          60 seconds · No sign-up · No financial advice.
        </motion.p>
      </div>

      {/* ════════════ SVG CITY + FEAR CARDS ════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="relative w-full" style={{ maxHeight: '70vh' }}>
            <svg
              viewBox="0 0 960 540"
              className="w-full h-full"
              preserveAspectRatio="xMidYMax meet"
              role="img"
              aria-label="An animated financial city showing money flowing between savings, index funds, and growth — representing the Kinetic investment journey."
              style={{
                filter: pulse ? 'brightness(1.6)' : 'brightness(1)',
                transition: pulse ? 'filter 0.15s ease-in' : 'filter 0.25s ease-out',
              }}
            >
              <defs>
                <filter id="glow-sm"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-md"><feGaussianBlur stdDeviation="4" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-danger"><feGaussianBlur stdDeviation="6" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-accent-win"><feGaussianBlur stdDeviation="3" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>

              {/* ── Ground plane ──────────────────────────────────────── */}
              <motion.rect
                x="0" y={GY} width="960" height="150" fill={C.ground}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: D.ground, duration: 0.5 }}
              />

              {/* ── Roads — clearly brighter than ground ──────────────── */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D.roads, duration: 0.7 }}>
                <rect x="30" y={GY + 3} width="900" height="18" rx="2" fill={C.road} />
                <line x1="40" y1={GY + 12} x2="920" y2={GY + 12} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" strokeDasharray="6 5" />

                {/* Pulse dots — 4px radius, 80% opacity */}
                <circle r="4" fill={C.accent} opacity="0.8" className="kinetic-anim kc-dot-glow">
                  <animateMotion dur="5s" repeatCount="indefinite" path={`M80,${GY+12} L420,${GY+12}`} />
                </circle>
                <circle r="4" fill={C.teal} opacity="0.8" className="kinetic-anim kc-dot-glow">
                  <animateMotion dur="4s" repeatCount="indefinite" path={`M500,${GY+12} L680,${GY+12}`} />
                </circle>
                <circle r="3" fill={C.accent} opacity="0.4" className="kinetic-anim kc-dot-glow">
                  <animateMotion dur="8s" repeatCount="indefinite" path={`M840,${GY+12} L120,${GY+12}`} />
                </circle>
              </motion.g>

              {/* ═══════ BLD 4: FD VAULT — dullest, deliberate ═══════ */}
              <motion.g
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: D.b(4), ...rise }}
                style={{ transformOrigin: `90px ${GY}px` }}
              >
                <rect x="40" y={GY-55} width="100" height="55" rx="2" fill={C.surfBase} stroke={C.border} strokeWidth="0.5" />
                {/* Padlock — white at 60% */}
                <rect x="80" y={GY-40} width="14" height="11" rx="2" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <path d={`M83,${GY-40} V${GY-45} a5,5 0 0,1 8,0 V${GY-40}`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                {/* FD rate — secondary text */}
                <text x="90" y={GY-15} fill={C.txtMd} fontSize="7" fontFamily="Inter,sans-serif" textAnchor="middle">FD: 6.8%</text>
                {/* Coin bouncing off door — muted white */}
                <circle r="3" cx="108" cy={GY-28} fill="rgba(255,255,255,0.45)" className="kinetic-anim kc-coin-reject" />
                {/* Comparison arrows */}
                <text x="52" y={GY+30} fill={C.danger} fontSize="6" fontFamily="Inter,sans-serif">← 6.8%</text>
                <text x="100" y={GY+30} fill={C.teal} fontSize="6.5" fontFamily="Inter,sans-serif" fontWeight="600">14% →</text>
              </motion.g>

              {/* ═══════ BLD 1: FEAR TOWER — threatening, dim, red glow ═══ */}
              <motion.g
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: D.b(3), ...rise }}
                style={{ transformOrigin: `200px ${GY}px` }}
                filter="url(#glow-danger)"
              >
                <rect x="175" y={GY-200} width="50" height="200" rx="2" fill={C.surfFear} stroke="rgba(226,75,74,0.15)" strokeWidth="0.8" />

                {/* LED screen */}
                <rect x="180" y={GY-178} width="40" height="50" rx="2" fill="#060a0c" />

                {/* Candlestick bars — FULL danger opacity, clearly red */}
                {[0,1,2,3,4].map(i => {
                  const x = 184 + i * 7
                  const h = 30 - i * 4
                  return <rect key={`c${i}`} x={x} y={GY-172+(30-h)} width="4.5" height={h} rx="0.5"
                    fill={C.danger} opacity="1" className={`kinetic-anim kc-candle-${i+1}`} />
                })}

                {/* Fear percentage */}
                <text x="200" y={GY-130} fill={C.danger} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{fearPct}%</text>

                {/* Antenna */}
                <line x1="200" y1={GY-200} x2="200" y2={GY-215} stroke={C.txtLo} strokeWidth="1" />
                <circle cx="200" cy={GY-217} r="3" fill={C.danger} className="kinetic-anim kc-antenna" />

                {/* FEAR INDEX billboard — danger, blinking */}
                <text x="200" y={GY-224} fill={C.danger} fontSize="5" fontFamily="Inter,sans-serif" textAnchor="middle" letterSpacing="1.5" fontWeight="600" className="kinetic-anim kc-label-blink">FEAR INDEX</text>

                {/* Frozen figures */}
                <g opacity="0.5">
                  <circle cx="186" cy={GY-8} r="3" fill={C.txtLo} />
                  <rect x="184" y={GY-5} width="5" height="5" rx="1" fill={C.txtLo} />
                  <circle cx="213" cy={GY-8} r="3" fill={C.txtLo} />
                  <rect x="211" y={GY-5} width="5" height="5" rx="1" fill={C.txtLo} />
                </g>
              </motion.g>

              {/* ═══════ BLD 6: CRASH MEMORIAL ═══════════════════════ */}
              <motion.g
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: D.b(5), ...rise }}
                style={{ transformOrigin: `290px ${GY}px` }}
              >
                <polygon points={`284,${GY} 296,${GY} 294,${GY-50} 290,${GY-58} 286,${GY-50}`} fill={C.surfHover} stroke={C.border} strokeWidth="0.5" />
                <text x="290" y={GY-40} fill={C.danger} fontSize="4" fontFamily="monospace" textAnchor="middle" opacity="0.7">2008 -60%</text>
                <text x="290" y={GY-30} fill={C.danger} fontSize="4" fontFamily="monospace" textAnchor="middle" opacity="0.7">2020 -38%</text>
                <text x="290" y={GY-20} fill={C.danger} fontSize="4" fontFamily="monospace" textAnchor="middle" opacity="0.7">2022 -16%</text>
                {/* Eternal flame — clearly visible */}
                <ellipse cx="290" cy={GY-60} rx="3" ry="5" fill={C.accent} className="kinetic-anim kc-flame" />
              </motion.g>

              {/* ═══════ BLD 2: INDEX TEMPLE — brightest, centrepiece ═══ */}
              <motion.g
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: D.b(0), ...rise }}
                style={{ transformOrigin: `460px ${GY}px` }}
              >
                {/* Main body — brightest building */}
                <rect x="355" y={GY-150} width="210" height="150" rx="3" fill={C.surfBright} stroke={C.borderBrt} strokeWidth="0.5" />
                {/* Pediment */}
                <polygon points={`355,${GY-150} 460,${GY-175} 565,${GY-150}`} fill={C.surfBright} stroke={C.borderBrt} strokeWidth="0.5" />
                {/* Columns */}
                {[374,398,422,446,470,494,518,542].map((x,i) => (
                  <rect key={`col${i}`} x={x} y={GY-145} width="3.5" height="105" rx="1" fill="rgba(255,255,255,0.08)" />
                ))}

                {/* NIFTY 50 label */}
                <text x="460" y={GY-153} fill={C.txtHi} fontSize="6" fontFamily="Inter,sans-serif" textAnchor="middle" letterSpacing="2.5" fontWeight="700">NIFTY 50</text>

                {/* Bar chart panel — darker background for contrast */}
                <rect x="378" y={GY-130} width="164" height="70" rx="3" fill="rgba(0,0,0,0.3)" />
                {/* 8 teal bars at 80% opacity */}
                {[0,1,2,3,4,5,6,7].map(i => {
                  const bx = 386 + i * 19
                  const bh = 24 + (i * 7 % 14) + 6
                  return <rect key={`b${i}`} x={bx} y={GY-62-bh} width="12" height={bh} rx="1.5"
                    fill={C.teal} opacity="0.8" className={`kinetic-anim kc-bar-${i+1}`} />
                })}

                {/* Upper windows — accent at 70% with bloom */}
                <g filter="url(#glow-accent-win)">
                  {[[378,GY-138],[408,GY-138],[438,GY-138],[488,GY-138],[518,GY-138],[548,GY-138]].map(([wx,wy],i) => (
                    <rect key={`w${i}`} x={wx} y={wy} width="6" height="4" rx="0.5" fill={C.accent} opacity="0.7"
                      className={`kinetic-anim kc-win-${['a','b','c','d','a','b'][i]}`} />
                  ))}
                </g>

                {/* Rooftop clock — LARGE, readable, accent at full opacity */}
                <rect x="418" y={GY-192} width="84" height="18" rx="5" fill="#050a0c" stroke={C.border} strokeWidth="0.5" />
                <text x="460" y={GY-179} fill={C.accent} fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold" opacity="1">{clock}</text>
              </motion.g>

              {/* ═══════ BLD 3: SIP FACTORY ═════════════════════════ */}
              <motion.g
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: D.b(1), ...rise }}
                style={{ transformOrigin: `650px ${GY}px` }}
                className="kinetic-anim kc-factory-glow"
              >
                <rect x="600" y={GY-115} width="100" height="115" rx="3" fill={C.surfHover} stroke={C.border} strokeWidth="0.5" />
                {/* Smokestack */}
                <rect x="672" y={GY-145} width="14" height="42" rx="1" fill={C.surfHover} stroke={C.border} strokeWidth="0.4" />

                {/* Coins — accent at FULL opacity, bright gold */}
                {[0,1,2].map(i => (
                  <circle key={`coin${i}`} cx="679" cy={GY-147} r="3.5" fill={C.accent} opacity="1"
                    className={`kinetic-anim kc-coin-${i+1}`} />
                ))}

                {/* ₹500/mo label — accent, legible */}
                <text x="650" y={GY-88} fill={C.accent} fontSize="6" fontFamily="Inter,sans-serif" textAnchor="middle" letterSpacing="0.8" fontWeight="600">₹500/mo</text>

                {/* Conveyor belt — lighter track */}
                <rect x="607" y={GY-62} width="82" height="2" rx="1" fill="rgba(255,255,255,0.12)" />
                <rect x="610" y={GY-68} width="8" height="5" rx="1" fill={C.accent} opacity="0.7" className="kinetic-anim kc-pkg-1" />
                <rect x="610" y={GY-68} width="8" height="5" rx="1" fill={C.accent} opacity="0.7" className="kinetic-anim kc-pkg-2" />

                {/* SIP counter — accent, readable */}
                <rect x="610" y={GY-48} width="60" height="16" rx="3" fill="#050a0c" stroke={C.border} strokeWidth="0.3" />
                <text x="640" y={GY-37} fill={C.accent} fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{sipCount}</text>

                {/* Windows */}
                <rect x="608" y={GY-105} width="8" height="6" rx="1" fill={C.accent} opacity="0.5" className="kinetic-anim kc-win-a" />
                <rect x="624" y={GY-105} width="8" height="6" rx="1" fill={C.accent} opacity="0.5" className="kinetic-anim kc-win-b" />
              </motion.g>

              {/* ═══════ BLD 5: ARJUN LIGHTHOUSE ═══════════════════ */}
              <motion.g
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: D.b(2), ...rise }}
                style={{ transformOrigin: `830px ${GY}px` }}
              >
                <polygon points={`815,${GY} 845,${GY} 840,${GY-185} 820,${GY-185}`} fill={C.surfHover} stroke={C.border} strokeWidth="0.5" />
                {/* Lantern room */}
                <rect x="816" y={GY-200} width="28" height="16" rx="4" fill={C.surfBright} stroke={C.accent} strokeWidth="0.5" />

                {/* Beam — 35% opacity, clearly visible */}
                <g className="kinetic-anim kc-beam" style={{ transformOrigin: `830px ${GY-192}px` }}>
                  <polygon points={`830,${GY-192} 720,${GY-225} 720,${GY-218}`} fill={C.accent} opacity="0.35" />
                </g>

                {/* Portholes — accent at 60% */}
                <circle cx="830" cy={GY-155} r="3" fill={C.accent} opacity="0.6" className="kinetic-anim kc-port-a" />
                <circle cx="830" cy={GY-125} r="3" fill={C.accent} opacity="0.6" className="kinetic-anim kc-port-b" />
                <circle cx="830" cy={GY-95} r="3" fill={C.accent} opacity="0.6" className="kinetic-anim kc-port-a" />

                {/* Door with warm light */}
                <rect x="824" y={GY-15} width="12" height="15" rx="1.5" fill={C.surfHover} stroke={C.amber} strokeWidth="0.5" />
                <rect x="825" y={GY-14} width="10" height="13" rx="1" fill={C.amber} className="kinetic-anim kc-door-light" filter="url(#glow-sm)" />
              </motion.g>

              {/* ── Trees ──────────────────────────────────────────── */}
              <motion.g
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: D.trees, duration: 0.3, type: 'spring', stiffness: 300, damping: 16 }}
              >
                {[245,320,570,730,780,870,60].map((tx,i) => (
                  <g key={`t${i}`} className="kinetic-anim kc-tree" style={{ transformOrigin: `${tx}px ${GY}px` }}>
                    <polygon points={`${tx},${GY-20} ${tx-6},${GY-5} ${tx+6},${GY-5}`} fill="rgba(29,158,117,0.22)" />
                    <rect x={tx-1.5} y={GY-7} width="3" height="7" rx="0.5" fill="rgba(29,158,117,0.15)" />
                  </g>
                ))}
              </motion.g>

              {/* ── Street Lights ──────────────────────────────────── */}
              {[250,340,565,760].map((sx,i) => (
                <g key={`sl${i}`}>
                  <rect x={sx} y={GY-16} width="1.5" height="16" fill={C.txtLo} />
                  <rect x={sx-2.5} y={GY-18} width="6" height="1.5" fill={C.txtLo} />
                  <circle cx={sx+3.5} cy={GY-18} r="2" fill={C.amber} opacity="0.45" filter="url(#glow-sm)" />
                </g>
              ))}

              {/* ── Fear Type Cards (foreignObject inside SVG) ─────── */}
              {fearCards.map((card, i) => (
                <motion.g
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: [0, -8, 0] }}
                  transition={{
                    opacity: { delay: D.card(i), duration: 0.6 },
                    y: { delay: D.card(i) + 0.6, duration: 4.2 + i * 0.3, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' },
                  }}
                >
                  <foreignObject x={card.x} y={card.y} width="140" height="40" style={{ overflow: 'visible' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderBottom: `1.5px solid ${card.color}80`,
                        pointerEvents: 'none' as const,
                      }}
                    >
                      <span style={{ color: card.color, display: 'flex' }}><card.Icon /></span>
                      <span style={{ color: card.color, fontSize: '11px', fontWeight: 500, fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap' }}>{card.label}</span>
                    </div>
                  </foreignObject>
                </motion.g>
              ))}

              {/* ── Market Ticker ──────────────────────────────────── */}
              <motion.g
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: D.ticker, duration: 0.3 }}
              >
                <rect x="0" y="517" width="960" height="23" fill="rgba(255,255,255,0.06)" />
                <line x1="0" y1="517" x2="960" y2="517" stroke={C.border} strokeWidth="1" />
                <foreignObject x="0" y="517" width="960" height="23">
                  <div style={{ overflow: 'hidden', width: '100%', height: '23px', display: 'flex', alignItems: 'center' }}>
                    <div className="kinetic-anim kc-ticker-track" style={{ display: 'flex', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.02em', color: C.txtMd }}>
                      <span><TickerContent /></span>
                      <span><TickerContent /></span>
                    </div>
                  </div>
                </foreignObject>
              </motion.g>

            </svg>
          </div>
        </div>

        {/* Bottom gradient — soft fade into bg */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '20%', background: 'linear-gradient(to bottom, transparent, #00161b)' }}
        />
      </div>
    </div>
  )
}
