import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  AreaSeries,
  ColorType,
  CrosshairMode,
} from 'lightweight-charts'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchChartData, type ChartPoint } from '../../lib/api'

const PERIODS = ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const
type Period = typeof PERIODS[number]

function formatValue(v: number): string {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`
  return `₹${v.toLocaleString('en-IN')}`
}

export default function PerformanceChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)
  const [period, setPeriod] = useState<Period>('1Y')
  const [tooltip, setTooltip] = useState<{ date: string; value: string } | null>(null)
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)

  // ── Fetch data from backend when period changes ──────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchChartData(period)
      .then(data => {
        if (!cancelled) {
          setChartData(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [period])

  // ── Create chart once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255,255,255,0.4)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.04)' },
        horzLines: { color: 'rgba(255,255,255,0.04)' },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          color: 'rgba(192,241,142,0.3)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#0e2000',
        },
        horzLine: {
          color: 'rgba(192,241,142,0.3)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#0e2000',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.06)',
        textColor: 'rgba(255,255,255,0.35)',
        scaleMargins: { top: 0.1, bottom: 0.05 },
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.06)',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: { mouseWheel: false, pressedMouseMove: false },
      handleScale: { mouseWheel: false, pinch: false },
    })

    const series = chart.addSeries(AreaSeries, {
      lineColor: '#c0f18e',
      topColor: 'rgba(192,241,142,0.18)',
      bottomColor: 'rgba(192,241,142,0)',
      lineWidth: 2,
      priceFormat: {
        type: 'custom',
        formatter: (p: number) => formatValue(p),
        minMove: 1000,
      },
    })
    chartRef.current = chart
    seriesRef.current = series

    chart.subscribeCrosshairMove(param => {
      if (!param.time || !param.seriesData) {
        setTooltip(null)
        return
      }
      const d = param.seriesData.get(series) as { value: number } | undefined
      if (!d) { setTooltip(null); return }
      setTooltip({
        date: String(param.time),
        value: formatValue(d.value),
      })
    })

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth })
      }
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [])

  // ── Feed data into chart ─────────────────────────────────────────────────
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || chartData.length === 0) return
    seriesRef.current.setData(chartData)
    chartRef.current.timeScale().fitContent()
  }, [chartData])

  const lastPoint = chartData[chartData.length - 1]
  const firstPoint = chartData[0]
  const change = lastPoint && firstPoint
    ? ((lastPoint.value - firstPoint.value) / firstPoint.value) * 100
    : 0
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' as const }}
      className="bg-[#071a1f] border border-white/[0.06] rounded-3xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 md:px-8 pt-6 pb-4">
        <div>
          <div className="flex items-baseline gap-3 mb-0.5">
            <h2 className="font-display text-lg text-white font-medium tracking-tight">
              Portfolio Performance
            </h2>
            {chartData.length > 0 && (
              <span className={`text-sm font-mono font-bold ${isPositive ? 'text-[#c0f18e]' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </span>
            )}
          </div>
          <p className="text-[11px] font-sans text-white/35 tracking-wide">
            {tooltip
              ? <><span className="text-white/60 font-medium">{tooltip.value}</span> &middot; {tooltip.date}</>
              : loading
                ? 'Loading chart data...'
                : 'Institutional grade real-time tracking'
            }
          </p>
        </div>

        <div className="flex items-center gap-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-sans font-semibold tracking-wider transition-all duration-150
                ${p === period
                  ? 'bg-[#c0f18e]/10 text-[#c0f18e] border border-[#c0f18e]/20'
                  : 'text-white/35 hover:text-white/60'
                }`}
            >
              {p}
            </button>
          ))}

          <div className="w-px h-5 bg-white/10 mx-2" />

          <button className="flex items-center gap-1.5 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/5 transition-colors">
            <span className="text-[11px] font-sans text-white/50">Area</span>
            <ChevronDown className="w-3 h-3 text-white/30" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="w-full" style={{ height: '340px' }} />

      {/* Footer */}
      <div className="flex justify-between items-center px-6 md:px-8 py-3 border-t border-white/[0.04]">
        <span className="text-[10px] font-mono text-white/25 tracking-widest uppercase">
          Data: Real-time · Backend Connected
        </span>
        <span className="text-[10px] font-mono text-white/25 tracking-widest">
          {lastPoint ? formatValue(lastPoint.value) : '—'}
        </span>
      </div>
    </motion.div>
  )
}
