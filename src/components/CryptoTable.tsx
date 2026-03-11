import { useMemo, useState } from 'react'
import { useTickers } from '../hooks/useCrypto'
import { formatCurrency, formatPercent } from '../lib/utils'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowUpDown, Star } from 'lucide-react'

interface CryptoTableProps {
  searchQuery: string
  watchlist: string[]
  toggleWatchlist: (id: string) => void
}

type SortKey = 'rank' | 'name' | 'price_usd' | 'percent_change_1h' | 'percent_change_24h' | 'market_cap_usd' | 'volume24'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 20
const TABS = ['Top', 'Trending', 'Gainers', 'Decliner', 'Most Visited'] as const

export default function CryptoTable({ searchQuery, watchlist, toggleWatchlist }: CryptoTableProps) {
  const { data, loading } = useTickers(0, 100)
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)
  const [activeTab, setActiveTab] = useState<string>('Top')

  const coins = useMemo(() => {
    if (!data?.data) return []
    let list = [...data.data]

    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      )
    }

    // Tab-based filtering
    if (activeTab === 'Gainers') {
      list = list.filter((c) => parseFloat(c.percent_change_24h) > 0)
    } else if (activeTab === 'Decliner') {
      list = list.filter((c) => parseFloat(c.percent_change_24h) < 0)
    }

    // sort
    list.sort((a, b) => {
      const va = sortKey === 'name' ? a.name : Number(a[sortKey])
      const vb = sortKey === 'name' ? b.name : Number(b[sortKey])
      if (typeof va === 'string' && typeof vb === 'string')
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })

    return list
  }, [data, searchQuery, sortKey, sortDir, activeTab])

  const totalPages = Math.ceil(coins.length / PAGE_SIZE)
  const pageCoins = coins.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: 'rank', label: '#' },
    { key: 'name', label: 'Name' },
    { key: 'price_usd', label: 'Price', align: 'right' },
    { key: 'percent_change_1h', label: '01h %', align: 'right' },
    { key: 'percent_change_24h', label: '24h %', align: 'right' },
    { key: 'market_cap_usd', label: 'Market Cap', align: 'right' },
    { key: 'volume24', label: 'Volume', align: 'right' },
  ]

  if (loading) {
    return (
      <div className="glass-card-static p-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton h-12 mb-2 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="glass-card-static overflow-hidden animate-fade-in-up" style={{ animationDelay: '150ms' }}>
      {/* Tab bar */}
      <div className="flex items-center justify-center px-5 pt-5 pb-3 flex-wrap gap-3">
        <div className="pill-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`pill-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setPage(0) }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)' }}>
              <th className="px-5 py-3 text-left w-10" style={{ color: 'var(--text-muted)' }}>
                {/* Star */}
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 text-[11px] font-semibold cursor-pointer select-none uppercase tracking-wider ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                  style={{ color: sortKey === col.key ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown size={10} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Last 24h
              </th>
            </tr>
          </thead>
          <tbody>
            {pageCoins.map((coin, idx) => {
              const ch1h = parseFloat(coin.percent_change_1h)
              const ch24h = parseFloat(coin.percent_change_24h)
              const watched = watchlist.includes(coin.id)
              const positive = ch24h >= 0
              return (
                <tr
                  key={coin.id}
                  className="transition-colors duration-150 cursor-pointer group"
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => navigate(`/coin/${coin.id}`)}
                >
                  <td className="px-5 py-3.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWatchlist(coin.id) }}
                      className="cursor-pointer transition-colors"
                      style={{ color: watched ? '#facc15' : 'var(--text-muted)' }}
                    >
                      <Star size={14} fill={watched ? '#facc15' : 'none'} />
                    </button>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-sm" style={{ color: 'var(--text-muted)' }}>
                    {String(idx + 1 + page * PAGE_SIZE).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--gradient-card)', color: 'var(--accent)' }}>
                        {coin.symbol[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{coin.name}</span>
                        <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                          {coin.symbol}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(coin.price_usd)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-xs" style={{ color: ch1h >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {formatPercent(coin.percent_change_1h)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-xs" style={{ color: ch24h >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {formatPercent(coin.percent_change_24h)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatCurrency(coin.market_cap_usd)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatCurrency(coin.volume24)}
                  </td>
                  {/* Mini sparkline for last 24h */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-block w-20 h-8">
                      <svg viewBox="0 0 80 30" className="w-full h-full" preserveAspectRatio="none">
                        <path
                          d={positive
                            ? 'M0,24 C10,22 18,18 30,16 C42,14 50,12 60,8 C70,5 75,4 80,3'
                            : 'M0,6 C10,8 18,12 30,14 C42,16 50,18 60,22 C70,25 75,26 80,27'}
                          fill="none"
                          stroke={positive ? '#22c55e' : '#ef4444'}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, coins.length)} of {coins.length} coins
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors disabled:opacity-25 cursor-pointer"
            style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <ChevronLeft size={15} />
          </button>
          {/* Page numbers */}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={i === page
                ? { background: 'var(--accent)', color: 'white', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }
                : { color: 'var(--text-muted)' }
              }
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors disabled:opacity-25 cursor-pointer"
            style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
