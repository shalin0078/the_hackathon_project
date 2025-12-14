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
  Globe,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface CoinData {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  icon: string
}

export function EnhancedRealMarket() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<'live' | 'fallback' | 'error'>('live')
  const [fromCurrency, setFromCurrency] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("ETH")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [retryCount, setRetryCount] = useState(0)

  const coinSymbols = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'SOL', 'MATIC', 'AVAX', 'DOT', 'LINK', 'LTC', 'DOGE', 'SHIB', 'UNI']

  const getCoinIcon = (symbol: string): string => {
    const icons: Record<string, string> = {
      'BTC': '₿', 'ETH': '⟠', 'USDT': '💰', 'USDC': '💵', 'BNB': '🟡',
      'ADA': '🔵', 'SOL': '☀️', 'MATIC': '🔺', 'AVAX': '🔺', 'DOT': '⚫',
      'LINK': '🔗', 'LTC': 'Ł', 'DOGE': '🐕', 'SHIB': '🐕', 'UNI': '🦄'
    }
    return icons[symbol] || '🪙'
  }

  // Multiple API endpoints for redundancy
  const apiEndpoints = [
    // Direct CoinGecko (may fail due to CORS)
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin,cardano,solana,matic-network,avalanche-2,polkadot,chainlink,litecoin,dogecoin,shiba-inu,uniswap&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true',
    
    // CORS Proxy 1
    'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin,cardano,solana,matic-network,avalanche-2,polkadot,chainlink,litecoin,dogecoin,shiba-inu,uniswap&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true'),
    
    // CORS Proxy 2
    'https://corsproxy.io/?' + encodeURIComponent('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin,cardano,solana,matic-network,avalanche-2,polkadot,chainlink,litecoin,dogecoin,shiba-inu,uniswap&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true'),
    
    // CORS Proxy 3
    'https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin,cardano,solana,matic-network,avalanche-2,polkadot,chainlink,litecoin,dogecoin,shiba-inu,uniswap&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true'
  ]

  const coinIdMap: Record<string, string> = {
    'bitcoin': 'BTC', 'ethereum': 'ETH', 'tether': 'USDT', 'usd-coin': 'USDC',
    'binancecoin': 'BNB', 'cardano': 'ADA', 'solana': 'SOL', 'matic-network': 'MATIC',
    'avalanche-2': 'AVAX', 'polkadot': 'DOT', 'chainlink': 'LINK', 'litecoin': 'LTC',
    'dogecoin': 'DOGE', 'shiba-inu': 'SHIB', 'uniswap': 'UNI'
  }

  const coinNames: Record<string, string> = {
    'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'USDT': 'Tether', 'USDC': 'USD Coin',
    'BNB': 'BNB', 'ADA': 'Cardano', 'SOL': 'Solana', 'MATIC': 'Polygon',
    'AVAX': 'Avalanche', 'DOT': 'Polkadot', 'LINK': 'Chainlink', 'LTC': 'Litecoin',
    'DOGE': 'Dogecoin', 'SHIB': 'Shiba Inu', 'UNI': 'Uniswap'
  }

  const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const data = await response.json()
        return data
      } catch (error) {
        console.log(`Attempt ${i + 1} failed:`, error)
        if (i === retries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
      }
    }
  }

  const fetchRealMarketData = async () => {
    setIsLoading(true)
    setRetryCount(prev => prev + 1)
    
    // Try each API endpoint
    for (let i = 0; i < apiEndpoints.length; i++) {
      try {
        console.log(`Trying API endpoint ${i + 1}...`)
        const data = await fetchWithRetry(apiEndpoints[i])
        
        if (data && typeof data === 'object') {
          const formattedCoins: CoinData[] = Object.entries(data).map(([coinId, coinData]: [string, any]) => {
            const symbol = coinIdMap[coinId] || coinId.toUpperCase()
            return {
              symbol,
              name: coinNames[symbol] || symbol,
              price: coinData.usd || 0,
              change24h: coinData.usd_24h_change || 0,
              marketCap: coinData.usd_market_cap || 0,
              volume24h: coinData.usd_24h_vol || 0,
              icon: getCoinIcon(symbol)
            }
          })
          
          if (formattedCoins.length > 0) {
            setCoins(formattedCoins)
            setApiStatus('live')
            setLastUpdated(new Date())
            setIsLoading(false)
            console.log(`✅ Successfully fetched data from endpoint ${i + 1}`)
            return
          }
        }
      } catch (error) {
        console.log(`❌ Endpoint ${i + 1} failed:`, error)
        continue
      }
    }
    
    // If all APIs fail, use enhanced fallback data
    console.log('🔄 All APIs failed, using enhanced fallback data')
    setApiStatus('fallback')
    generateEnhancedFallbackData()
    setIsLoading(false)
  }

  const generateEnhancedFallbackData = () => {
    // Base prices (realistic as of recent market data)
    const basePrices: Record<string, number> = {
      'BTC': 43250, 'ETH': 2580, 'USDT': 1.00, 'USDC': 1.00, 'BNB': 315,
      'ADA': 0.52, 'SOL': 98.5, 'MATIC': 0.89, 'AVAX': 37.2, 'DOT': 7.8,
      'LINK': 14.5, 'LTC': 73.2, 'DOGE': 0.082, 'SHIB': 0.0000098, 'UNI': 6.7
    }
    
    const enhancedCoins: CoinData[] = coinSymbols.map(symbol => {
      const basePrice = basePrices[symbol] || 1
      // Add realistic market fluctuation (±3%)
      const fluctuation = (Math.random() - 0.5) * 0.06
      const currentPrice = basePrice * (1 + fluctuation)
      
      // Generate realistic 24h change (±10%)
      const change24h = (Math.random() - 0.5) * 20
      
      // Calculate realistic market cap
      const marketCap = currentPrice * (symbol === 'BTC' ? 19500000 : 
                                      symbol === 'ETH' ? 120000000 :
                                      symbol === 'USDT' ? 95000000000 / currentPrice :
                                      Math.random() * 10000000000 + 1000000000)
      
      return {
        symbol,
        name: coinNames[symbol] || symbol,
        price: currentPrice,
        change24h,
        marketCap,
        volume24h: marketCap * (Math.random() * 0.15 + 0.05),
        icon: getCoinIcon(symbol)
      }
    })
    
    setCoins(enhancedCoins)
    setLastUpdated(new Date())
  }

  useEffect(() => {
    fetchRealMarketData()
    const interval = setInterval(fetchRealMarketData, 30000) // Try every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Convert between currencies
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const fromCoin = coins.find(c => c.symbol === fromCurrency)
      const toCoin = coins.find(c => c.symbol === toCurrency)
      
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

  const getStatusBadge = () => {
    switch (apiStatus) {
      case 'live':
        return <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30 animate-pulse">
          <CheckCircle className="h-3 w-3 mr-1" />
          Live Data
        </Badge>
      case 'fallback':
        return <Badge variant="outline" className="bg-chart-4/20 text-chart-4 border-chart-4/30">
          <AlertCircle className="h-3 w-3 mr-1" />
          Enhanced Fallback
        </Badge>
      default:
        return <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30">
          <AlertCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
    }
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
                Enhanced Market Data
              </CardTitle>
              <CardDescription>
                Multi-source cryptocurrency data with intelligent fallbacks
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
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
          {apiStatus === 'fallback' && (
            <div className="mb-4 p-3 bg-chart-4/10 border border-chart-4/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-chart-4 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-chart-4">Using Enhanced Fallback Data</p>
                  <p className="text-muted-foreground">Live APIs temporarily unavailable. Showing realistic market simulation with {retryCount} retry attempts.</p>
                </div>
              </div>
            </div>
          )}
          
          {isLoading && coins.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="p-4 border border-border/50 rounded-lg animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {coins.map((coin) => {
                const ChangeIcon = getChangeIcon(coin.change24h)
                const changeColor = getChangeColor(coin.change24h)
                
                return (
                  <Card key={coin.symbol} className="border-border/50 hover-glow transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{coin.icon}</span>
                          <div>
                            <p className="font-semibold text-sm">{coin.symbol}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[80px]">{coin.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Price</span>
                          <span className="font-mono text-sm font-semibold">
                            ${formatPrice(coin.price)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">24h</span>
                          <div className={`flex items-center gap-1 text-xs ${changeColor}`}>
                            <ChangeIcon className="h-3 w-3" />
                            <span>{coin.change24h > 0 ? "+" : ""}{coin.change24h.toFixed(2)}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Cap</span>
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
            <span>
              {apiStatus === 'live' ? 'Live from CoinGecko' : 'Enhanced simulation'} • 
              Retry #{retryCount}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Live Currency Converter */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Enhanced Converter
          </CardTitle>
          <CardDescription>
            Convert between cryptocurrencies using {apiStatus === 'live' ? 'live' : 'enhanced'} market prices
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
                      <SelectItem key={currency.symbol} value={currency.symbol}>
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
                      <SelectItem key={currency.symbol} value={currency.symbol}>
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate:</span>
                <span className="font-mono">
                  1 {fromCurrency} = {formatPrice(parseFloat(toAmount) / parseFloat(fromAmount))} {toCurrency}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}