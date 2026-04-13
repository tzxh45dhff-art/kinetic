import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { getFearFraming, type NewsItem } from '../../lib/newsAPI'
import { ExternalLink } from 'lucide-react'

/* ── Sentiment colors ─────────────────────────────────────────────────────── */

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'var(--teal)',
  negative: 'var(--danger)',
  neutral: 'rgba(255,255,255,0.25)',
}

/* ══════════════════════════════════════════════════════════════════════════
   NEWS IMPACT CARD — single relevant news item for contextual pages
   ══════════════════════════════════════════════════════════════════════════ */

interface Props {
  context: 'simulation' | 'sandbox' | 'portfolio' | 'learn'
  fearType?: string
}

export default function NewsImpactCard({ context, fearType }: Props) {
  const newsItems = useAppStore(s => s.newsItems) || []
  const ft = fearType || useAppStore.getState().fearType || 'loss'

  if (!newsItems.length) return null

  // Pick most relevant item for context
  let item: NewsItem | undefined

  if (context === 'simulation') {
    item = newsItems.find((n: NewsItem) => n.category === 'macro') || newsItems[0]
  } else if (context === 'portfolio') {
    item = newsItems.find((n: NewsItem) => n.category === 'market') || newsItems[0]
  } else if (context === 'learn') {
    item = newsItems.find((n: NewsItem) => n.category === 'market' && n.sentiment !== 'neutral') || newsItems[0]
  } else {
    item = newsItems[0]
  }

  if (!item) return null

  const contextLabel: Record<string, string> = {
    simulation: "This week's market context for your simulation",
    portfolio: 'What\u2019s moving your portfolio',
    learn: 'Current context \u2014 how today compares',
    sandbox: 'Market context',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-4 border"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        borderLeft: `3px solid ${SENTIMENT_COLORS[item.sentiment]}`,
      }}
    >
      <p className="font-sans text-[10px] text-white/20 uppercase tracking-wider mb-2">
        {contextLabel[context]}
      </p>

      <div className="flex items-start gap-2.5">
        <div
          className="w-2 h-2 rounded-full mt-1 shrink-0"
          style={{ background: SENTIMENT_COLORS[item.sentiment] }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[13px] font-medium text-white/70 leading-snug">
            {item.title}
          </p>
          <p className="font-sans text-[11px] italic mt-1.5" style={{ color: 'var(--accent)' }}>
            → {getFearFraming(item, ft)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-sans text-[10px] text-white/20">{item.source}</span>
            <span className="font-sans text-[10px] text-white/10">·</span>
            <span className="font-sans text-[10px] text-white/20">{item.time}</span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-sans text-[10px] ml-auto transition-[color] duration-150 hover:text-white/40"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              >
                Read more <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
