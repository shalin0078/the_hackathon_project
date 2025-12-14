"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  ArrowUpDown,
  Coins,
  Calculator,
  Loader2,
  DollarSign,
  Globe
} from "lucide-react"

interface CoinData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  image: string
}

interface FormattedCoin {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  icon: string
}

export function RealMarketData() {
  const [coins, setCoins] = useState<FormattedCoin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromCurrency, setFromCurrency] = useState("bitcoin")
  const [toCurrency, setToCurrency] = useState("ethereum")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const coinIds = [
    'bitcoin', 'ethereum', 'tether', 'usd-coin', 'binancecoin', 
    'cardano', 'solana', 'matic-network', 'avalanche-2', 'polkadot',
    'chainlink', 'litecoin', 'dogecoin', 'shiba-inu', 'polygon'
  ]

  const getCoinIcon = (symbol: string): string => {
    const icons: Record<string, string> = {
      'btc': '₿', 'eth': '⟠', 'usdt': '💰', 'usdc': '💵', 'bnb': '🟡',
      'ada': '🔵', 'sol': '☀️', 'matic': '🔺', 'avax': '🔺', 'dot': '⚫',
      'link': '🔗', 'ltc': 'Ł', 'doge': '🐕', 'shib': '🐕', 'pol': '🔺'
    }
    return icons[symbol.toLowerCase()] || '🪙'
  }

  const fetchRealMarketData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Using a CORS proxy to fetch from CoinGecko
      const proxyUrl = 'https://api.allorigins.win/raw?url='
      const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h`
      
      const response = await fetch(proxyUrl + encodeURIComponent(apiUrl))
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data')
      }
      
      const data: CoinData[] = await response.json()
      
      const formattedCoins: FormattedCoin[] = data.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        icon: getCoinIcon(coin.symbol)
      }))
      
      setCoins(formattedCoins)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching market data:', err)
      setError('Failed to fetch real-time data. Using fallback data.')
      
      // Fallback to mock data if API fails
      const fallbackData: FormattedCoin[] = [
        { symbol: 'BTC', name: 'Bitcoin', price: 43250, change24h: 2.5, marketCap: 850000000000, volume24h: 15000000000, icon: '₿' },
        { symbol: 'ETH', name: 'Ethereum', price: 2580, change24h: -1.2, marketCap: 310000000000, volume24h: 8000000000, icon: '⟠' },
        { symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0.1, marketCap: 95000000000, volume24h: 25000000000, icon: '💰' },
        { symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.0, marketCap: 25000000000, volume24h: 3000000000, icon: '💵' },
        { symbol: 'BNB', name: 'BNB', price: 315, change24h: 1.8, marketCap: 47000000000, volume24h: 800000000, icon: '🟡' },
        { symbol: 'ADA', name: 'Cardano', price: 0.52, change24h: -0.8, marketCap: 18000000000, volume24h: 400000000, icon: '🔵' },
        { symbol: 'SOL', name: 'Solana', price: 98.5, change24h: 3.2, marketCap: 42000000000, volume24h: 1200000000, icon: '☀️' },
        { symbol: 'MATIC', name: 'Polygon', price: 0.89, change24h: -2.1, marketCap: 8500000000, volume24h: 350000000, icon: '🔺' }
      ]
      setCoins(fallbackData)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRealMarketData()
    const interval = setInterval(fetchRealMarketData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Convert between currencies
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const fromCoin = coins.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === fromCurrency || c.symbol.toLowerCase() === fromCurrency)
      const toCoin = coins.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === toCurrency || c.symbol.toLowerCase() === toCurrency)
      
      if (fromCoin && toCoin) {
        const convertedAmount = (parseFloat(fromAmount) * fromCoin.price) / toCoin.price
        setToAmount(formatPrice(convertedAmount))
      }
    } else {
      setToAmount("")
    }
  }, [fromAmount, fromCurrency, toCurrency, coins])

  const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
    if (price >= 1) return price.toFixed(4)
    if (price >= 0.01) return price.toFixed(6)
    return price.toFixed(8)
  }

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString()}`
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount(toAmount)
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-chart-2"
    if (change < 0) return "text-destructive"
    return "text-muted-foreground"
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return TrendingUp
    if (change < 0) return TrendingDown
    return DollarSign
  }

  return (
    <div className="space-y-6">
      {/* Real-time Market Data */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Real-Time Market Data
              </CardTitle>
              <CardDescription>
                Live cryptocurrency prices from CoinGecko API
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {error ? (
                <Badge variant="outline" className="bg-chart-4/20 text-chart-4 border-chart-4/30">
                  Fallback Data
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30 animate-pulse">
                  Live
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRealMarketData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-chart-4/10 border border-chart-4/20 rounded-lg text-sm text-chart-4">
              {error}
            </div>
          )}
          
          {isLoading && coins.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="p-4 border border-border/50 rounded-lg animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {coins.map((coin) => {
                const ChangeIcon = getChangeIcon(coin.change24h)
                const changeColor = getChangeColor(coin.change24h)
                
                return (
                  <Card key={coin.symbol} className="border-border/50 hover-glow transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{coin.icon}</span>
                          <div>
                            <p className="font-semibold">{coin.symbol}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[100px]">{coin.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <span className="font-mono text-sm font-semibold">
                            ${formatPrice(coin.price)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">24h</span>
                          <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
                            <ChangeIcon className="h-3 w-3" />
                            <span>{coin.change24h > 0 ? "+" : ""}{coin.change24h.toFixed(2)}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Cap</span>
                          <span className="text-xs font-medium">
                            {formatMarketCap(coin.marketCap)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span>Data from CoinGecko • Updates every minute</span>
          </div>
        </CardContent>
      </Card>

      {/* Live Currency Converter */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Real-Time Converter
          </CardTitle>
          <CardDescription>
            Convert between cryptocurrencies using live market prices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="from-amount">From</Label>
              <div className="space-y-2">
                <Input
                  id="from-amount"
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="text-lg font-mono"
                />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {coins.map((currency) => (
                      <SelectItem key={currency.symbol} value={currency.name.toLowerCase().replace(/\s+/g, '-')}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{currency.icon}</span>
                          <span>{currency.symbol}</span>
                          <span className="text-muted-foreground text-sm">
                            ${formatPrice(currency.price)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-center md:col-span-2 md:order-3">
              <Button
                variant="outline"
                size="sm"
                onClick={swapCurrencies}
                className="rounded-full h-10 w-10 p-0"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 md:order-4">
              <Label htmlFor="to-amount">To</Label>
              <div className="space-y-2">
                <Input
                  id="to-amount"
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="text-lg font-mono bg-muted/50"
                />
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {coins.map((currency) => (
                      <SelectItem key={currency.symbol} value={currency.name.toLowerCase().replace(/\s+/g, '-')}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{currency.icon}</span>
                          <span>{currency.symbol}</span>
                          <span className="text-muted-foreground text-sm">
                            ${formatPrice(currency.price)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {fromAmount && toAmount && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="font-mono">
                    1 {coins.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === fromCurrency)?.symbol} = {formatPrice(parseFloat(toAmount) / parseFloat(fromAmount))} {coins.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === toCurrency)?.symbol}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}