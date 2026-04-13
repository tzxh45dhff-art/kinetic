import type { NewsItem } from '../../lib/newsAPI'

/* ── Sentiment dot colors ────────────────────────────────────────────────── */

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'var(--teal)',
  negative: 'var(--danger)',
  neutral: 'rgba(255,255,255,0.25)',
}

/* ══════════════════════════════════════════════════════════════════════════
   NEWS TICKER BAR — horizontal scrolling marquee
   ══════════════════════════════════════════════════════════════════════════ */

interface Props {
  items: NewsItem[]
}

export default function NewsTickerBar({ items }: Props) {
  if (!items.length) return null

  // Double the items for seamless infinite scroll
  const doubled = [...items, ...items]

  return (
    <div
      className="w-full flex items-center overflow-hidden group"
      style={{
        height: 36,
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Keyframes */}
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
        }
        .group:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* NEWS label */}
      <div
        className="flex items-center shrink-0 h-full px-3"
        style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}
      >
        <span
          className="font-sans text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: 'var(--accent)' }}
        >
          NEWS
        </span>
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-track flex items-center whitespace-nowrap" style={{ width: 'max-content' }}>
          {doubled.map((item, i) => (
            <span key={`${item.title}-${i}`} className="inline-flex items-center gap-1.5 px-4">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: SENTIMENT_COLORS[item.sentiment] }}
              />
              <span className="font-sans text-[12px] text-white/60">{item.title}</span>
              <span className="font-sans text-[11px] text-white/20">·</span>
              <span className="font-sans text-[11px] text-white/25">{item.source}</span>
              <span className="font-sans text-[11px] text-white/10 pl-2">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
