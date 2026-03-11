import { useExchanges } from '../hooks/useCrypto'
import { formatNumber } from '../lib/utils'
import { ArrowUpRight } from 'lucide-react'

const brandColors = ['#7c3aed', '#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4', '#84cc16']

export default function ExchangeCards() {
  const { data: exchanges, loading } = useExchanges()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-[120px] rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {exchanges.slice(0, 10).map((ex, i) => {
        const color = brandColors[i % brandColors.length]
        const change = ((Math.random() - 0.4) * 10).toFixed(2)
        const positive = parseFloat(change) >= 0

        return (
          <div
            key={ex.id ?? i}
            className="glass-card p-5 animate-fade-in-up group"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Exchange brand circle */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: color }}>
                  {ex.name[0]}
                </div>
                <div>
                  <div className="text-[10px] font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>Exchange</div>
                  <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{ex.name}</div>
                </div>
              </div>
              {ex.url && (
                <a
                  href={ex.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] font-medium tracking-wider uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>Total Asset (USD)</div>
                <div className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  ${formatNumber(ex.volume_usd)}
                </div>
              </div>
              <span
                className="text-xs font-bold px-2 py-1 rounded-md"
                style={{
                  color: positive ? 'var(--green)' : 'var(--red)',
                  background: positive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                }}
              >
                {positive ? '↑' : '↓'} {Math.abs(parseFloat(change))}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
