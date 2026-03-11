import { useParams, useNavigate } from 'react-router-dom'
import { useCoin, useCoinMarkets } from '../hooks/useCrypto'
import { formatCurrency, formatPercent, formatNumber } from '../lib/utils'
import { ArrowLeft, Globe, TrendingUp, TrendingDown, Clock, Layers, Star } from 'lucide-react'

interface CoinDetailProps {
  watchlist: string[]
  toggleWatchlist: (id: string) => void
}

export default function CoinDetail({ watchlist, toggleWatchlist }: CoinDetailProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: coin, loading: coinLoading } = useCoin(id || '')
  const { data: markets, loading: marketsLoading } = useCoinMarkets(id || '')

  if (coinLoading || !coin) {
    return (
      <div className="animate-pulse flex flex-col gap-6">
        <div className="skeleton h-10 w-32 rounded-xl" />
        <div className="glass-card h-64 rounded-2xl" />
        <div className="glass-card h-96 rounded-2xl" />
      </div>
    )
  }

  const isWatched = watchlist.includes(coin.id)
  const ch24h = parseFloat(coin.percent_change_24h)
  const ch7d = parseFloat(coin.percent_change_7d)

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fade-in-up">
      {/* Header Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      {/* Main Info Card */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'var(--accent)', transform: 'translate(30%, -30%)' }} />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ background: 'var(--gradient-card)', border: '1px solid var(--border-color)' }}>
              <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{coin.symbol[0]}</span>
            </div>
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{coin.name}</h1>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  {coin.symbol}
                </span>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  Rank #{coin.rank}
                </span>
              </div>
              
              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(coin.price_usd)}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold" style={{ color: ch24h >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {ch24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(ch24h)}% (24h)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <button
              onClick={() => toggleWatchlist(coin.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ 
                background: isWatched ? 'rgba(250, 204, 21, 0.1)' : 'var(--bg-secondary)',
                color: isWatched ? '#facc15' : 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <Star size={16} fill={isWatched ? '#facc15' : 'none'} />
              {isWatched ? 'Watched' : 'Add to Watchlist'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <Globe size={14} /> Market Cap
            </div>
            <div className="font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{formatCurrency(coin.market_cap_usd)}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <Clock size={14} /> Volume (24h)
            </div>
            <div className="font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{formatCurrency(coin.volume24)}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <Layers size={14} /> Circulating Supply
            </div>
            <div className="font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(coin.csupply)} <span className="text-xs font-normal text-muted">{coin.symbol}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <TrendingUp size={14} /> 7d Change
            </div>
            <div className="font-bold whitespace-nowrap" style={{ color: ch7d >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {formatPercent(ch7d)}
            </div>
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Exchange Markets</h2>
        </div>
        
        {marketsLoading ? (
          <div className="p-5 flex flex-col gap-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-10 w-full rounded-lg" />)}
          </div>
        ) : !markets?.length ? (
          <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>No markets found for this coin.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th className="px-5 py-3 text-left font-semibold" style={{ color: 'var(--text-muted)' }}>Exchange</th>
                  <th className="px-5 py-3 text-left font-semibold" style={{ color: 'var(--text-muted)' }}>Pair</th>
                  <th className="px-5 py-3 text-right font-semibold" style={{ color: 'var(--text-muted)' }}>Price (USD)</th>
                  <th className="px-5 py-3 text-right font-semibold" style={{ color: 'var(--text-muted)' }}>Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                {markets.slice(0, 20).map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{m.name}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-semibold text-xs py-1 px-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)]">
                        {m.base}/{m.quote}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(m.price_usd)}
                    </td>
                    <td className="px-5 py-3 text-right" style={{ color: 'var(--text-secondary)' }}>
                      {formatCurrency(m.volume_usd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
