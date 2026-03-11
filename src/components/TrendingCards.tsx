import { useTickers } from '../hooks/useCrypto'
import { formatCurrency, formatPercent } from '../lib/utils'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function TrendingCards({ limit = 5 }: { limit?: number }) {
  const { data, loading } = useTickers(0, limit)
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="skeleton h-[200px] rounded-2xl" />
        ))}
      </div>
    )
  }

  const coins = data?.data ?? []

  // Color scheme for each card
  const cardColors = [
    { gradient: 'linear-gradient(135deg, #7c3aed22, #6366f122)', line: '#7c3aed', fill: '#7c3aed' },
    { gradient: 'linear-gradient(135deg, #3b82f622, #60a5fa22)', line: '#3b82f6', fill: '#3b82f6' },
    { gradient: 'linear-gradient(135deg, #22c55e22, #4ade8022)', line: '#22c55e', fill: '#22c55e' },
    { gradient: 'linear-gradient(135deg, #f59e0b22, #fbbf2422)', line: '#f59e0b', fill: '#f59e0b' },
    { gradient: 'linear-gradient(135deg, #ef444422, #f8717122)', line: '#ef4444', fill: '#ef4444' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {coins.map((coin, i) => {
        const change = parseFloat(coin.percent_change_24h)
        const positive = change >= 0
        const colors = cardColors[i % cardColors.length]

        return (
          <div
            key={coin.id}
            className="glass-card overflow-hidden cursor-pointer animate-fade-in-up group"
            style={{ animationDelay: `${i * 70}ms` }}
            onClick={() => navigate(`/coin/${coin.id}`)}
          >
            {/* Top content */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Proof of Stake
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <ArrowUpRight size={14} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {/* Coin icon circle */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: colors.gradient, color: colors.line }}>
                  {coin.symbol[0]}
                </div>
                <div>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{coin.name} </span>
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                    {coin.symbol}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Token Price</div>
                  <div className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(coin.price_usd)}
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-md"
                  style={{
                    color: positive ? 'var(--green)' : 'var(--red)',
                    background: positive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  }}
                >
                  {formatPercent(coin.percent_change_24h)}
                </span>
              </div>
            </div>

            {/* Sparkline chart area */}
            <div className="h-16 mt-1 sparkline-area">
              <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`tg-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.fill} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={colors.fill} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={positive
                    ? 'M0,48 C20,44 35,40 55,36 C75,32 85,28 105,22 C125,16 140,20 160,14 C175,10 185,8 200,6 V60 H0 Z'
                    : 'M0,12 C20,16 35,20 55,24 C75,28 85,32 105,38 C125,44 140,40 160,46 C175,50 185,52 200,54 V60 H0 Z'}
                  fill={`url(#tg-${coin.id})`}
                />
                <path
                  d={positive
                    ? 'M0,48 C20,44 35,40 55,36 C75,32 85,28 105,22 C125,16 140,20 160,14 C175,10 185,8 200,6'
                    : 'M0,12 C20,16 35,20 55,24 C75,28 85,32 105,38 C125,44 140,40 160,46 C175,50 185,52 200,54'}
                  fill="none"
                  stroke={colors.line}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Data point markers */}
                {positive ? (
                  <>
                    <circle cx="55" cy="36" r="2.5" fill={colors.line} opacity="0.5" />
                    <circle cx="105" cy="22" r="2.5" fill={colors.line} opacity="0.5" />
                    <circle cx="160" cy="14" r="2.5" fill={colors.line} opacity="0.5" />
                  </>
                ) : (
                  <>
                    <circle cx="55" cy="24" r="2.5" fill={colors.line} opacity="0.5" />
                    <circle cx="105" cy="38" r="2.5" fill={colors.line} opacity="0.5" />
                    <circle cx="160" cy="46" r="2.5" fill={colors.line} opacity="0.5" />
                  </>
                )}
              </svg>
            </div>
          </div>
        )
      })}
    </div>
  )
}
