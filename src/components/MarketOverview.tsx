import { useGlobalData } from '../hooks/useCrypto'
import { formatCurrency, formatNumber } from '../lib/utils'
import { Globe, BarChart3, Bitcoin, Layers, Coins } from 'lucide-react'
import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  change?: string
  color: string
  delay: number
}

function StatCard({ icon, label, value, change, color, delay }: StatCardProps) {
  return (
    <div
      className="glass-card p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: `${color}14`, color }}
        >
          {icon}
        </div>
        {change && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-md"
            style={{
              color: parseFloat(change) >= 0 ? 'var(--green)' : 'var(--red)',
              background: parseFloat(change) >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            }}
          >
            {parseFloat(change) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(change)).toFixed(2)}%
          </span>
        )}
      </div>
      <div className="text-[11px] font-medium mb-1.5 tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  )
}

export default function MarketOverview() {
  const { data, loading } = useGlobalData()

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-[120px] rounded-2xl" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const cards: Omit<StatCardProps, 'delay'>[] = [
    { icon: <Globe size={20} />,    label: 'Total Market Cap', value: formatCurrency(data.total_mcap), change: data.mcap_change, color: '#7c3aed' },
    { icon: <BarChart3 size={20} />, label: '24h Volume',       value: formatCurrency(data.total_volume), change: data.volume_change, color: '#3b82f6' },
    { icon: <Bitcoin size={20} />,   label: 'BTC Dominance',    value: `${data.btc_d}%`, color: '#f59e0b' },
    { icon: <Layers size={20} />,    label: 'ETH Dominance',    value: `${data.eth_d}%`, color: '#6366f1' },
    { icon: <Coins size={20} />,     label: 'Total Coins',      value: formatNumber(data.coins_count), color: '#22c55e' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} delay={i * 60} />
      ))}
    </div>
  )
}
