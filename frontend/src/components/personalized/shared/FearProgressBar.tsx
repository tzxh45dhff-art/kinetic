import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

export default function FearProgressBar() {
  const fearProgress = useAppStore(s => s.fearProgress)
  const [showTooltip, setShowTooltip] = useState(false)

  const progressValue = useMotionValue(0)
  const width = useTransform(progressValue, [0, 100], ['0%', '100%'])

  useEffect(() => {
    animate(progressValue, fearProgress, {
      duration: 1.2,
      ease: 'easeOut',
    })
  }, [fearProgress, progressValue])

  // Animated display number
  const [displayNum, setDisplayNum] = useState(0)
  useEffect(() => {
    const unsubscribe = progressValue.on('change', (v) => {
      setDisplayNum(Math.round(v))
    })
    return unsubscribe
  }, [progressValue])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      className="w-full"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-sans text-white/50">
          Fear overcome: <span className="text-white/80 font-medium">{displayNum}%</span>
        </span>
        {showTooltip && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-sans text-white/30"
          >
            Complete modules to reduce your fear score.
          </motion.span>
        )}
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            width,
            background: 'linear-gradient(90deg, #EF9F27, #EFB84D)',
          }}
        />
      </div>
    </motion.div>
  )
}
