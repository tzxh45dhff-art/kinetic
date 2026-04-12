import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAppStore, type FearType } from '../../../store/useAppStore'

const NEXT_STEPS: Record<FearType, { text: string; action: string }> = {
  loss: {
    text: 'Run the Time Machine simulation',
    action: 'time-machine',
  },
  jargon: {
    text: 'Kill 3 more words in the Jargon Graveyard',
    action: 'learn',
  },
  scam: {
    text: 'Take the Scam vs Real quiz',
    action: 'learn',
  },
  trust: {
    text: 'Try the Fee Erosion Calculator',
    action: 'learn',
  },
}

export default function NextStepCard() {
  const fearType = useAppStore(s => s.fearType) ?? 'loss'
  const setDashboardSection = useAppStore(s => s.setDashboardSection)
  const step = NEXT_STEPS[fearType]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onClick={() => setDashboardSection(step.action)}
      className="rounded-3xl p-6 border cursor-pointer group transition-[background-color,border-color,transform] duration-200 hover:scale-[1.01]"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.16)' }}
    >
      <p className="text-[9px] font-sans font-bold tracking-[0.2em] text-white/25 uppercase mb-3">
        What to do next
      </p>
      <div className="flex items-center justify-between">
        <p className="font-display text-sm text-white/80 font-medium">
          Next: {step.text}
        </p>
        <ArrowRight className="w-4 h-4 text-[var(--color-primary-fixed)] group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </motion.div>
  )
}
