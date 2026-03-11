import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Star,
  Layers,
} from 'lucide-react'

export const topLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', match: '' },
  { to: '/?tab=markets', icon: BarChart3, label: 'Markets', match: 'markets' },
  { to: '/?tab=trending', icon: TrendingUp, label: 'Trending', match: 'trending' },
  { to: '/?tab=exchanges', icon: Layers, label: 'Exchanges', match: 'exchanges' },
  { to: '/?tab=watchlist', icon: Star, label: 'Watchlist', match: 'watchlist' },
]



export default function Sidebar() {
  const location = useLocation()
  const currentTab = new URLSearchParams(location.search).get('tab') || ''

  const renderLink = ({ to, icon: Icon, label, match }: typeof topLinks[0]) => {
    const isActive = location.pathname === '/' && currentTab === match
    return (
      <NavLink
        key={label}
        to={to}
        title={label}
        className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200"
        style={
          isActive
            ? { background: 'var(--gradient-purple)', color: 'white', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }
            : { color: 'var(--text-muted)' }
        }
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-secondary)' }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
      >
        <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
      </NavLink>
    )
  }

  return (
    <>
      <aside
        className="fixed left-0 top-0 z-40 h-screen flex flex-col items-center py-5 max-md:hidden"
        style={{
          width: '72px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Top nav */}
        <nav className="flex flex-col items-center gap-2 flex-1 mt-4">
          {topLinks.map(renderLink)}
        </nav>

        {/* Divider */}
        <div className="w-8 h-px my-3" style={{ background: 'var(--border-color)' }} />
      </aside>

      {/* Spacer for layout */}
      <div className="shrink-0 max-md:hidden" style={{ width: '72px' }} />
    </>
  )
}
