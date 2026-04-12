import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } }
}

export default function Hero() {
  const setView = useAppStore(state => state.setView)

  return (
    <section id="problem" className="relative min-h-screen flex items-center px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-16 pt-28 pb-16">

        {/* Left Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="lg:w-[55%] w-full"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[var(--color-primary-fixed)] uppercase">
              The Financial Reality
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display font-semibold leading-[0.92] tracking-[-0.03em] mb-8 text-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
          >
            Your money is{' '}
            <span className="text-[var(--color-primary-fixed)] italic">shrinking.</span>
            <br />You just can't{' '}
            <br />see it.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-sans text-base md:text-lg text-white/60 leading-[1.7] max-w-md mb-10"
          >
            Inflation is the silent thief of your future. Staying still isn't safe — it's the riskiest move you can make. Kinetic has your back as you set the path, think all the free.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <button
              onClick={() => setView('quiz')}
              className="bg-[var(--color-primary-fixed)] hover:bg-[#b4e882] text-[#0a1a00] font-sans font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 box-glow active:scale-[0.97] text-center"
            >
              Break the Fear
            </button>

            <button
              onClick={() => setView('quiz')}
              className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-[0.97] font-sans text-sm font-medium"
            >
              View Your Risk
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-5"
          >
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('kinetic:open-login'))}
              className="font-sans text-xs text-white/30 hover:text-white/55 transition-colors duration-200"
            >
              Already have an account? <span className="underline" style={{ color: 'var(--color-primary-fixed)' }}>Log in</span>
            </button>
          </motion.p>
        </motion.div>

        {/* Right — Image placeholder / data card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' as const }}
          className="lg:w-[42%] w-full flex justify-end"
        >
          {/* IMAGE PLACEHOLDER — drop hero.jpg into /src/assets/ to replace */}
          <div className="glass rounded-3xl w-full max-w-[400px] aspect-[4/5] border border-white/[0.07] relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute -inset-8 bg-[var(--color-primary-fixed)]/5 blur-[60px] rounded-[40px] -z-10" />

            {/* Placeholder content */}
            <div className="text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-fixed)]/10 border border-[var(--color-primary-fixed)]/20 flex items-center justify-center mb-4 mx-auto">
                <div className="w-7 h-7 border-2 border-[var(--color-primary-fixed)] rounded-sm opacity-60" />
              </div>
              <p className="text-[10px] font-mono text-white/25 tracking-widest uppercase">
                Image Placeholder
              </p>
              <p className="text-[9px] font-sans text-white/20 mt-1">
                Add hero.jpg to /src/assets/
              </p>
            </div>

            {/* Decorative bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/[0.05] flex justify-between items-center">
              <span className="text-[9px] font-mono text-white/30 tracking-wider">KINETIC</span>
              <span className="text-[9px] font-mono text-[var(--color-primary-fixed)]">LIVE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
