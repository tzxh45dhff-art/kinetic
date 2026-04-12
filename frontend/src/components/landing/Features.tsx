import { motion } from 'framer-motion'
import { Lock, ArrowRight } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const types = [
  {
    name: 'The Hesitator',
    desc: 'Knows they need to invest but never quite finds the right moment. Analysis paralysis is real.',
  },
  {
    name: 'The Panicker',
    desc: 'Every market dip feels like a crisis. Selling low and buying high — the costly cycle.',
  },
  {
    name: 'The Observer',
    desc: 'Watches others succeed from the sidelines. Knowledge without action costs compounding years.',
  },
  {
    name: 'The Avoider',
    desc: 'Finance feels complex and scary, so it gets avoided entirely. Not easy — to be avoided.',
  },
]

export default function Features() {
  const setView = useAppStore(state => state.setView)

  return (
    <section id="fear-types" className="py-28 md:py-40 px-6 md:px-12 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-20 gap-10">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' as const }}
            className="font-display font-semibold leading-[0.95] tracking-[-0.025em] text-white"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            WHAT KIND OF<br />INVESTOR<br />ARE YOU?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' as const }}
            className="font-sans text-white/50 text-base leading-relaxed max-w-sm"
          >
            Fear manifests differently for everyone. Identifying your pattern is the first step toward mastery.
          </motion.p>
        </div>

        {/* Type cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {types.map((type, i) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const }}
              className="bg-white/[0.03] rounded-3xl p-8 border border-white/[0.06] hover:bg-white/[0.055] hover:border-white/10 transition-[background-color,border-color] duration-500 group cursor-default"
            >
              <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-8">
                <Lock className="w-4 h-4 text-white/30 group-hover:text-[var(--color-primary-fixed)] transition-colors duration-300" />
              </div>
              <h3 className="font-display text-lg text-white font-medium mb-3 tracking-tight">
                {type.name}
              </h3>
              <p className="font-sans text-sm text-white/45 leading-[1.75]">
                {type.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' as const }}
          className="flex justify-center"
        >
          <button
            onClick={() => setView('quiz')}
            className="flex items-center gap-2.5 font-sans font-semibold text-sm text-[var(--color-primary-fixed)] hover:gap-4 transition-all duration-200"
          >
            Take the Fear Type Quiz
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </section>
  )
}
