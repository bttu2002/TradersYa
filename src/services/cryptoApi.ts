const BASE = import.meta.env.PROD ? '/api/proxy' : '/api/proxy'

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE}${endpoint}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

/* ── Types ── */
export interface GlobalData {
  coins_count: number
  active_markets: number
  total_mcap: number
  total_volume: number
  btc_d: string
  eth_d: string
  mcap_change: string
  volume_change: string
  avg_change_percent: string
}

export interface Coin {
  id: string
  symbol: string
  name: string
  nameid: string
  rank: number
  price_usd: string
  percent_change_24h: string
  percent_change_1h: string
  percent_change_7d: string
  market_cap_usd: string
  volume24: number
  volume24a: number
  csupply: string
  tsupply: string
  msupply: string
}

export interface TickersResponse {
  data: Coin[]
  info: { coins_num: number; time: number }
}

export interface Exchange {
  id: string
  name: string
  name_id: string
  volume_usd: number
  active_pairs: number
  url: string
  country: string
}

export interface CoinMarket {
  name: string
  base: string
  quote: string
  price: number
  price_usd: number
  volume: number
  volume_usd: number
  time: number
}

/* ── API calls ── */
export async function getGlobalData(): Promise<GlobalData[]> {
  return fetchApi<GlobalData[]>('/api/global/')
}

export async function getTickers(start = 0, limit = 100): Promise<TickersResponse> {
  return fetchApi<TickersResponse>(`/api/tickers/?start=${start}&limit=${limit}`)
}

export async function getCoinById(id: string): Promise<Coin[]> {
  return fetchApi<Coin[]>(`/api/ticker/?id=${id}`)
}

export async function getCoinMarkets(id: string): Promise<CoinMarket[]> {
  return fetchApi<CoinMarket[]>(`/api/coin/markets/?id=${id}`)
}

export async function getExchanges(): Promise<Record<string, Exchange>> {
  return fetchApi<Record<string, Exchange>>('/api/exchanges/')
}
