import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

export default function LowerWidgets() {
  const holdings = useAppStore(s => s.holdings)

  const hot = holdings?.hotTicker
  const dividend = holdings?.dividendAlert

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">

      {/* ── Capital Efficiency Banner ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' as const }}
        className="lg:col-span-2 rounded-3xl overflow-hidden relative min-h-[300px] flex flex-col"
        style={{ background: 'linear-gradient(145deg, #e8f5d8 0%, #d4edb8 100%)' }}
      >
        {/* Subtle dot mesh */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #0a2000 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-10">
          <div>
            <div className="inline-flex items-center bg-[#c0f18e]/60 text-[#0a2000] text-[8px] font-sans font-black tracking-[0.2em] px-3 py-1.5 rounded mb-8">
              ALGORITHM INSIGHT
            </div>

            <h2
              className="font-display font-bold text-[#050e05] tracking-[-0.03em] leading-[0.9] mb-5"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              CAPITAL<br />EFFICIENCY
            </h2>

            <p className="font-sans text-sm text-[#2a3a2a]/70 leading-relaxed max-w-xs">
              Identify liquidity gaps in derivatives markets. Unlock high-leverage opportunities with institutional risk parameters.
            </p>
          </div>

          <div className="mt-10">
            <button className="bg-[#050e05] hover:bg-[#0d1a0d] text-white font-sans font-bold text-[10px] tracking-[0.18em] px-7 py-3.5 rounded transition-colors active:scale-[0.97]">
              EXPLORE ALPHA
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Right Column ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">

        {/* Hot Ticker — from API */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' as const }}
          className="bg-[#071a1f] border border-white/[0.06] rounded-3xl p-6 flex flex-col justify-between flex-1 hover:border-white/10 transition-colors"
        >
          <div className="flex justify-between items-center mb-5">
            <span className="text-[8px] font-sans font-black tracking-[0.2em] text-[#c0f18e] uppercase">
              Hot Ticker
            </span>
            <span className="text-[10px] font-mono text-white/30">
              {hot?.time ?? '—'}
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-display text-2xl text-white font-semibold mb-1 tracking-tight">
                {hot?.symbol ?? '...'}
              </h3>
              <p className="text-xs font-sans text-white/35">{hot?.sector ?? ''}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl text-white font-medium mb-1 tracking-tight">
                {hot?.price ?? '—'}
              </p>
              <p className={`text-xs font-mono font-bold ${hot?.positive ? 'text-[#c0f18e]' : 'text-red-400'}`}>
                {hot?.change ?? ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dividend Alert — from API */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' as const }}
          className="bg-[#071a1f] border border-white/[0.06] rounded-3xl p-6 flex flex-col justify-between flex-1 hover:border-white/10 transition-colors"
        >
          <div className="flex justify-between items-center mb-5">
            <span className="text-[8px] font-sans font-black tracking-[0.2em] text-amber-400 uppercase">
              Dividend Alert
            </span>
            <span className="text-[10px] font-mono text-white/30">
              {dividend?.date ?? '—'}
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-display text-2xl text-white font-semibold mb-1 tracking-tight">
                {dividend?.symbol ?? '...'}
              </h3>
              <p className="text-xs font-sans text-white/35">{dividend?.sector ?? ''}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl text-white font-medium mb-1 tracking-tight">
                {dividend?.price ?? '—'}
              </p>
              <p className="text-xs font-sans text-white/35">
                {dividend?.dividendPerShare ?? ''}
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
