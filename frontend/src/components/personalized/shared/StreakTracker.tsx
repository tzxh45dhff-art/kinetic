import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Flame } from 'lucide-react'
import { useAppStore } from '../../../store/useAppStore'

// Week always Mon → Sun (Mon=1 in getDay, Sun=0)
const WEEK_DAYS = [1, 2, 3, 4, 5, 6, 0] // Mon Tue Wed Thu Fri Sat Sun
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function StreakTracker() {
  const streakDays = useAppStore(s => s.streakDays)
  const updateStreak = useAppStore(s => s.updateStreak)

  useEffect(() => {
    updateStreak()
  }, [updateStreak])

  const todayJS = new Date().getDay() // 0=Sun, 1=Mon ... 6=Sat
  // For each slot Mon–Sun, compute how many days ago it was
  const dots = WEEK_DAYS.map(dayJS => {
    let daysAgo = (todayJS - dayJS + 7) % 7
    // if daysAgo=0 → today; fill if within streak
    return daysAgo < streakDays
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-3xl p-6 border"
      style={{
        background: 'var(--surface)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(192,241,142,0.10)' }}>
          <Flame className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <p className="font-display text-sm text-white font-medium">
            {streakDays > 0 ? `Day ${streakDays} streak` : 'No streak yet'}
          </p>
          <p className="text-[10px] font-sans text-white/35">
            {streakDays > 0 ? "You're building a habit." : 'Come back tomorrow to start a streak.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {dots.map((filled, i) => {
          const isToday = WEEK_DAYS[i] === todayJS
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.05 * i, type: 'spring', stiffness: 500, damping: 25 }}
                className="w-5 h-5 rounded-full border"
                style={{
                  background: filled
                    ? 'var(--accent)'
                    : isToday
                      ? 'rgba(192,241,142,0.12)'
                      : 'rgba(255,255,255,0.04)',
                  borderColor: filled
                    ? 'rgba(192,241,142,0.35)'
                    : isToday
                      ? 'rgba(192,241,142,0.25)'
                      : 'rgba(255,255,255,0.08)',
                }}
              />
              <span className="text-[8px] font-sans" style={{ color: isToday ? 'var(--accent)' : 'rgba(255,255,255,0.2)' }}>
                {DAY_LABELS[i]}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
