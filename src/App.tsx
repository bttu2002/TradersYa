import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Home from './pages/Home'
import CoinDetail from './pages/CoinDetail'
import { useWatchlist, useTheme } from './hooks/useCrypto'

function App() {
  const { dark, toggle: toggleTheme } = useTheme()
  const { watchlist, toggle: toggleWatchlist } = useWatchlist()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'Inter', system-ui, sans-serif" }}>
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

          {/* Header */}
          <Header
            dark={dark}
            toggleTheme={toggleTheme}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />

          {/* Scrollable Main View */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-8 z-10 scroll-smooth">
            <div className="max-w-[1400px] mx-auto w-full">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      searchQuery={searchQuery}
                      watchlist={watchlist}
                      toggleWatchlist={toggleWatchlist}
                    />
                  }
                />
                <Route
                  path="/coin/:id"
                  element={
                    <CoinDetail
                      watchlist={watchlist}
                      toggleWatchlist={toggleWatchlist}
                    />
                  }
                />
              </Routes>
            </div>
            
            {/* Footer */}
            <footer className="mt-20 pb-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              <p>TradersYA &copy; 2026 &middot; Data by CoinLore API</p>
            </footer>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
