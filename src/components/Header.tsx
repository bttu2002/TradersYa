import { Search, Sun, Moon, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { topLinks } from './Sidebar'

interface HeaderProps {
  dark: boolean
  toggleTheme: () => void
  searchQuery: string
  onSearch: (q: string) => void
}

export default function Header({ dark, toggleTheme, searchQuery, onSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const currentTab = new URLSearchParams(location.search).get('tab') || ''

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-center h-16 shrink-0 relative px-5 md:px-8"
      style={{
        background: 'var(--bg-header)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="w-full max-w-[1400px] flex items-center justify-between relative">
        {/* Left side: Mobile menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className=" flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ background: 'var(--gradient-purple)' }}>
            <button onClick={() => window.location.href = '/'} className="text-white font-black text-sm tracking-wide" >YA</button >
          </div>
        </div>

        {/* Center: Search bar (absolute centered on desktop within the wrapper) */}
        <div className="hidden md:flex flex-1 max-w-lg absolute left-1/2 -translate-x-1/2">
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 w-full transition-all duration-200 focus-within:border-[var(--accent)]"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by project, quest, exchange, wallet or token"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-muted)] w-full"
              style={{ color: 'var(--text-primary)' }}
            />
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>/</kbd>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer"
            style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)', background: 'transparent' }}
            title="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile search & nav overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 p-4 md:hidden flex flex-col gap-4 shadow-xl" style={{ background: 'var(--bg-header)', borderBottom: '1px solid var(--border-color)', backdropFilter: 'blur(20px)' }}>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {topLinks.map(({ to, icon: Icon, label, match }) => {
              const isActive = location.pathname === '/' && currentTab === match
              return (
                <NavLink
                  key={label}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                  style={
                    isActive
                      ? { background: 'var(--gradient-purple)', color: 'white', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }
                      : { color: 'var(--text-primary)', background: 'var(--bg-secondary)' }
                  }
                >
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span className="font-semibold">{label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Search Bar */}
          <div className="flex items-center gap-2 rounded-xl px-4 py-3 mt-2" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search coins..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      )}
    </header>
  )
}
