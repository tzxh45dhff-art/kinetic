import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Clock } from 'lucide-react'

const stats = [
  {
    icon: <TrendingDown className="w-5 h-5 text-[var(--color-primary-fixed)]" />,
    top: '₹1,00,000',
    label: 'Value of ₹1 lakh after 7 years at current inflation rate',
    bottom: '−₹54,000',
    bottomNote: 'Purchasing power lost',
    bottomColor: 'text-red-400',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-[var(--color-primary-fixed)]" />,
    top: '12.4%',
    label: 'Average Nifty 50 return over 10 years',
    bottom: '3× Growth',
    bottomNote: "If you'd just start",
    bottomColor: 'text-[var(--color-primary-fixed)]',
  },
  {
    icon: <Clock className="w-5 h-5 text-[var(--color-primary-fixed)]" />,
    top: '7 Years',
    label: 'The average Indian investor waits 7 years too long to start',
    bottom: '42% Missed',
    bottomNote: 'Compounding returns',
    bottomColor: 'text-red-400',
  },
]

export default function Partners() {
  return (
    <section
      id="problem"
      className="py-28 md:py-40 px-6 md:px-12 border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' as const }}
          className="mb-16 max-w-2xl"
        >
          <h2
            className="font-display font-semibold text-white tracking-tight leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            The invisible cost of hesitation.
          </h2>
          <p className="font-sans text-white/50 text-base leading-relaxed">
            In India, inflation averages 6%+. If you manage to be paying faster than that, you are losing purchasing power every single hour.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.top}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 hover:bg-white/[0.05] hover:border-white/10 transition-[background-color,border-color] duration-500 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary-fixed)]/10 border border-[var(--color-primary-fixed)]/15 flex items-center justify-center mb-6">
                {stat.icon}
              </div>

              <p className="font-display font-semibold text-white mb-2 tracking-tight" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                {stat.top}
              </p>
              <p className="font-sans text-sm text-white/45 leading-relaxed mb-6">
                {stat.label}
              </p>

              <div className="border-t border-white/[0.06] pt-4">
                <p className={`font-display font-semibold text-xl mb-0.5 ${stat.bottomColor}`}>
                  {stat.bottom}
                </p>
                <p className="font-sans text-[11px] text-white/35">{stat.bottomNote}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
