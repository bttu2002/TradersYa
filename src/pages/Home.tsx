import { useSearchParams } from 'react-router-dom'
import MarketOverview from '../components/MarketOverview'
import TrendingCards from '../components/TrendingCards'
import CryptoTable from '../components/CryptoTable'
import ExchangeCards from '../components/ExchangeCards'
import { ArrowRight } from 'lucide-react'

interface HomeProps {
  searchQuery: string
  watchlist: string[]
  toggleWatchlist: (id: string) => void
}

export default function Home({ searchQuery, watchlist, toggleWatchlist }: HomeProps) {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'dashboard'

  return (
    <div className="flex flex-col gap-8">
      {/* ─── Dashboard View ─── */}
      {tab === 'dashboard' && (
        <>
          {/* Market Overview Stats */}
          <section className="flex justify-center w-full">
            <div className="w-full max-w-7xl">
              <MarketOverview />
            </div>
          </section>

          {/* Trending Projects Cards */}
          <section className="flex justify-center w-full">
            <div className="w-full max-w-7xl">
              <div className="section-header">
                <h2 className="section-title">Trending Now</h2>
                <button className="view-all-btn" onClick={() => window.location.href = '/?tab=trending'}>
                  View All <ArrowRight size={14} />
                </button>
              </div>
              <TrendingCards limit={5} />
            </div>
          </section>

          {/* Main Content: Table */}
          <div className="flex justify-center w-full">
            <section className="w-full max-w-7xl">
              <CryptoTable searchQuery={searchQuery} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
            </section>
          </div>

          {/* Trending Exchanges */}
          <section className="flex justify-center w-full">
            <div className="w-full max-w-7xl">
              <div className="section-header">
                <h2 className="section-title">Trending Projects</h2>
              </div>
              <ExchangeCards />
            </div>
          </section>
        </>
      )}

      {/* ─── Markets View ─── */}
      {tab === 'markets' && (
        <section className="flex justify-center w-full">
          <div className="w-full max-w-7xl">
            <div className="section-header">
              <h2 className="section-title">All Markets</h2>
            </div>
            <CryptoTable searchQuery={searchQuery} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
          </div>
        </section>
      )}

      {/* ─── Trending View ─── */}
      {tab === 'trending' && (
        <section className="flex justify-center w-full">
          <div className="w-full max-w-7xl">
            <div className="section-header">
              <h2 className="section-title">Trending Coins</h2>
            </div>
            <TrendingCards limit={20} />
          </div>
        </section>
      )}

      {/* ─── Exchanges View ─── */}
      {tab === 'exchanges' && (
        <section className="flex justify-center w-full">
          <div className="w-full max-w-7xl">
            <div className="section-header">
              <h2 className="section-title">Top Exchanges</h2>
            </div>
            <ExchangeCards />
          </div>
        </section>
      )}

      {/* ─── Watchlist View ─── */}
      {tab === 'watchlist' && (
        <section className="flex justify-center w-full">
          <div className="w-full max-w-7xl">
            <div className="section-header">
              <h2 className="section-title">My Watchlist</h2>
            </div>
            {watchlist.length === 0 ? (
              <div className="glass-card-static p-16 text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Your watchlist is empty</h3>
              </div>
            ) : (
              <CryptoTable searchQuery={searchQuery} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
            )}
          </div>
        </section>
      )}

    </div>
  )
}
