import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

export default function FinalCTA() {
  const setView = useAppStore(state => state.setView)
  const [email, setEmail] = useState('')

  function handleClaim(e: React.FormEvent) {
    e.preventDefault()
    setView('dashboard')
  }

  return (
    <section className="py-36 md:py-52 px-6 text-center relative overflow-hidden border-t border-white/[0.06]">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[var(--color-primary-fixed)]/[0.07] blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' as const }}
        className="relative z-10"
      >
        <h2
          className="font-display font-semibold tracking-[-0.03em] text-white mb-6"
          style={{ fontSize: 'clamp(2.2rem, 7vw, 5.5rem)' }}
        >
          You don't need a <br />terminal. You need a{' '}
          <span className="text-[var(--color-primary-fixed)] italic">path.</span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' as const }}
          className="font-sans text-white/50 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Investing isn't about outsmarting the market. It's about not letting your fear hesitate. We're here for the foundation and approach, not sorry.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' as const }}
          onSubmit={handleClaim}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full sm:flex-1 bg-white/[0.05] border border-white/[0.10] rounded-full px-5 py-3.5 text-sm font-sans text-white placeholder:text-white/35 outline-none focus:border-[var(--color-primary-fixed)]/50 transition-colors"
          />
          <button
            type="submit"
            className="shrink-0 bg-[var(--color-primary-fixed)] hover:bg-[#b4e882] text-[#0a1a00] font-sans font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 box-glow active:scale-[0.97] whitespace-nowrap"
          >
            Claim Your Journey
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-sans text-[11px] text-white/25 mt-5"
        >
          Product. No updates, no spam or tricks.
        </motion.p>
      </motion.div>
    </section>
  )
}
