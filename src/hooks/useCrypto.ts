import { useState, useEffect, useCallback } from 'react'
import {
  getGlobalData,
  getTickers,
  getCoinById,
  getCoinMarkets,
  getExchanges,
  type GlobalData,
  type Coin,
  type CoinMarket,
  type Exchange,
} from '../services/cryptoApi'

/* ── Generic fetch hook ── */
function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    fetcher()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { refetch() }, [refetch])

  return { data, loading, error, refetch }
}

/* ── Specific hooks ── */
export function useGlobalData() {
  const result = useAsync<GlobalData[]>(() => getGlobalData())
  return { ...result, data: result.data?.[0] ?? null }
}

export function useTickers(start = 0, limit = 100) {
  return useAsync(() => getTickers(start, limit), [start, limit])
}

export function useCoin(id: string) {
  const result = useAsync<Coin[]>(() => getCoinById(id), [id])
  return { ...result, data: result.data?.[0] ?? null }
}

export function useCoinMarkets(id: string) {
  return useAsync<CoinMarket[]>(() => getCoinMarkets(id), [id])
}

export function useExchanges() {
  const result = useAsync<Record<string, Exchange>>(() => getExchanges())
  const list = result.data ? Object.values(result.data) : []
  return { ...result, data: list }
}

/* ── Watchlist hook ── */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('watchlist') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const toggle = (id: string) =>
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )

  const isWatched = (id: string) => watchlist.includes(id)

  return { watchlist, toggle, isWatched }
}

/* ── Theme hook ── */
export function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggle: () => setDark((p) => !p) }
}
