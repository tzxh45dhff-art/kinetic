import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export default function WelcomeHeader() {
  const user = useAppStore(s => s.user)

  const name = user?.name ?? '...'
  const greeting = user?.greeting ?? ''
  const tip = user?.tip

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display font-medium text-3xl md:text-4xl text-white mb-2 leading-tight">
          Hello, {name}
        </h1>
        <p className="font-sans text-white/50 text-sm md:text-base">
          {greeting}
        </p>
      </motion.div>

      {tip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 border border-white/5 rounded-3xl px-5 py-4 flex items-start max-w-sm"
        >
          <div className="mt-0.5 w-6 h-6 rounded-full bg-[var(--color-primary-fixed)]/10 flex items-center justify-center shrink-0 mr-3">
            <Lightbulb className="w-3 h-3 text-[var(--color-primary-fixed)]" />
          </div>
          <div>
            <p className="text-[10px] font-sans font-bold tracking-widest text-[var(--color-primary-fixed)] uppercase mb-1">
              {tip.title}
            </p>
            <p className="text-xs font-sans text-white/60 leading-relaxed">
              {tip.message}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
