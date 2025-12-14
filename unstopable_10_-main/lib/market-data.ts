interface CoinGeckoPrice {
  usd: number
  usd_24h_change: number
  usd_market_cap?: number
  usd_24h_vol?: number
}

interface MarketData {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap?: number
  volume24h?: number
  lastUpdated: Date
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

const COIN_IDS: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'MATIC': 'matic-network',
  'BNB': 'binancecoin',
  'ADA': 'cardano',
  'SOL': 'solana',
  'DOT': 'polkadot',
  'AVAX': 'avalanche-2'
}

export class MarketDataService {
  private cache = new Map<string, { data: MarketData; timestamp: number }>()
  private readonly CACHE_DURATION = 30000 // 30 seconds

  async getPrice(symbol: string): Promise<MarketData | null> {
    const coinId = COIN_IDS[symbol.toUpperCase()]
    if (!coinId) return null

    // Check cache
    const cached = this.cache.get(symbol)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      const response = await fetch(
        `${COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      )
      
      if (!response.ok) throw new Error('Failed to fetch price')
      
      const data = await response.json()
      const priceData: CoinGeckoPrice = data[coinId]
      
      if (!priceData) return null

      const marketData: MarketData = {
        symbol: symbol.toUpperCase(),
        name: this.getCoinName(symbol),
        price: priceData.usd,
        change24h: priceData.usd_24h_change || 0,
        marketCap: priceData.usd_market_cap,
        volume24h: priceData.usd_24h_vol,
        lastUpdated: new Date()
      }

      // Cache the result
      this.cache.set(symbol, { data: marketData, timestamp: Date.now() })
      
      return marketData
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error)
      return null
    }
  }

  async getPrices(symbols: string[]): Promise<MarketData[]> {
    const promises = symbols.map(symbol => this.getPrice(symbol))
    const results = await Promise.all(promises)
    return results.filter((data): data is MarketData => data !== null)
  }

  async getTopCoins(limit: number = 10): Promise<MarketData[]> {
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
      )
      
      if (!response.ok) throw new Error('Failed to fetch top coins')
      
      const data = await response.json()
      
      return data.map((coin: any): MarketData => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        lastUpdated: new Date()
      }))
    } catch (error) {
      console.error('Failed to fetch top coins:', error)
      return []
    }
  }

  private getCoinName(symbol: string): string {
    const names: Record<string, string> = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'USDC': 'USD Coin',
      'USDT': 'Tether',
      'MATIC': 'Polygon',
      'BNB': 'BNB',
      'ADA': 'Cardano',
      'SOL': 'Solana',
      'DOT': 'Polkadot',
      'AVAX': 'Avalanche'
    }
    return names[symbol.toUpperCase()] || symbol.toUpperCase()
  }

  // Convert price to MNEE (mock conversion rate)
  convertToMNEE(usdPrice: number): number {
    const MNEE_USD_RATE = 1.2 // Mock: 1 MNEE = $1.20
    return usdPrice / MNEE_USD_RATE
  }

  // Format price with appropriate decimals
  formatPrice(price: number): string {
    if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
    if (price >= 1) return price.toFixed(4)
    if (price >= 0.01) return price.toFixed(6)
    return price.toFixed(8)
  }

  // Format market cap
  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString()}`
  }
}

export const marketDataService = new MarketDataService()