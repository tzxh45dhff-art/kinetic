import { motion } from 'framer-motion'
import { TrendingUp, Zap } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

// Icons by metric title
const ICONS: Record<string, React.ReactNode> = {
  'CURRENT VALUE': <TrendingUp className="w-3 h-3 mr-1.5" />,
  'XIRR': <Zap className="w-3 h-3 mr-1.5" />,
}

export default function MetricsGrid() {
  const metrics = useAppStore(s => s.metrics)

  // Loading skeleton
  if (!metrics) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-[#071619] border border-white/[0.06] rounded-3xl p-5 md:p-6 animate-pulse">
            <div className="h-2 w-20 bg-white/10 rounded mb-4" />
            <div className="h-6 w-28 bg-white/10 rounded mb-2" />
            <div className="h-2 w-24 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease: 'easeOut' as const }}
          className="bg-[#071619] border border-white/[0.06] rounded-3xl p-5 md:p-6 hover:border-white/10 transition-colors"
        >
          <p className="text-[9px] font-sans tracking-[0.18em] text-white/40 uppercase mb-4">
            {metric.title}
          </p>
          <p
            className="font-display font-semibold text-white tracking-tight mb-2"
            style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)' }}
          >
            {metric.value}
          </p>
          <div className={`flex items-center text-[11px] font-sans font-medium ${metric.highlight ? 'text-[var(--color-primary-fixed)]' : 'text-white/40'}`}>
            {ICONS[metric.title] || null}
            {metric.subtext}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
