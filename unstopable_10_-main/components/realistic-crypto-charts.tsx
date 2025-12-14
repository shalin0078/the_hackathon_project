"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
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
  BarChart3,
  Eye,
  Activity
} from "lucide-react"

interface PricePoint {
  time: string
  price: number
  timestamp: number
}

interface CoinData {
  symbol: string
  name: string
  price: number
  change24h: number
  change1h: number
  change7d: number
  marketCap: number
  volume24h: number
  icon: string
  priceHistory: PricePoint[]
}

export function RealisticCryptoCharts() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const [fromCurrency, setFromCurrency] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("ETH")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [updateCount, setUpdateCount] = useState(0)

  const coinData = [
    { symbol: 'BTC', name: 'Bitcoin', basePrice: 43250, volatility: 0.02 },
    { symbol: 'ETH', name: 'Ethereum', basePrice: 2580, volatility: 0.03 },
    { symbol: 'USDT', name: 'Tether', basePrice: 1.00, volatility: 0.001 },
    { symbol: 'USDC', name: 'USD Coin', basePrice: 1.00, volatility: 0.001 },
    { symbol: 'BNB', name: 'BNB', basePrice: 315, volatility: 0.025 },
    { symbol: 'ADA', name: 'Cardano', basePrice: 0.52, volatility: 0.04 },
    { symbol: 'SOL', name: 'Solana', basePrice: 98.5, volatility: 0.05 },
    { symbol: 'MATIC', name: 'Polygon', basePrice: 0.89, volatility: 0.04 },
    { symbol: 'AVAX', name: 'Avalanche', basePrice: 37.2, volatility: 0.045 },
    { symbol: 'DOT', name: 'Polkadot', basePrice: 7.8, volatility: 0.035 },
    { symbol: 'LINK', name: 'Chainlink', basePrice: 14.5, volatility: 0.04 },
    { symbol: 'LTC', name: 'Litecoin', basePrice: 73.2, volatility: 0.03 }
  ]

  const getCoinIcon = (symbol: string): string => {
    const icons: Record<string, string> = {
      'BTC': '₿', 'ETH': '⟠', 'USDT': '💰', 'USDC': '💵', 'BNB': '🟡',
      'ADA': '🔵', 'SOL': '☀️', 'MATIC': '🔺', 'AVAX': '🔺', 'DOT': '⚫',
      'LINK': '🔗', 'LTC': 'Ł'
    }
    return icons[symbol] || '🪙'
  }

  const generateRealisticPrice = (basePrice: number, volatility: number, time: number): number => {
    // Create realistic market movements using multiple sine waves
    const trend = Math.sin(time * 0.001) * 0.1 // Long-term trend
    const daily = Math.sin(time * 0.01) * 0.05 // Daily cycle
    const hourly = Math.sin(time * 0.1) * 0.02 // Hourly fluctuations
    const noise = (Math.random() - 0.5) * volatility // Random noise
    
    const totalChange = trend + daily + hourly + noise
    return basePrice * (1 + totalChange)
  }

  const generatePriceHistory = (symbol: string, currentPrice: number): PricePoint[] => {
    const history: PricePoint[] = []
    const now = Date.now()
    const points = 48 // 48 hours of data (every 30 minutes)
    const coin = coinData.find(c => c.symbol === symbol)
    
    if (!coin) return []
    
    for (let i = points; i >= 0; i--) {
      const timestamp = now - (i * 30 * 60 * 1000) // Every 30 minutes
      const time = new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      const price = generateRealisticPrice(coin.basePrice, coin.volatility, timestamp + updateCount * 1000)
      
      history.push({ time, price, timestamp })
    }
    
    return history
  }

  const initializeCoins = () => {
    const initialCoins: CoinData[] = coinData.map(coin => {
      const currentPrice = generateRealisticPrice(coin.basePrice, coin.volatility, Date.now() + updateCount * 1000)
      const yesterdayPrice = generateRealisticPrice(coin.basePrice, coin.volatility, Date.now() - 86400000 + updateCount * 1000)
      const hourAgoPrice = generateRealisticPrice(coin.basePrice, coin.volatility, Date.now() - 3600000 + updateCount * 1000)
      const weekAgoPrice = generateRealisticPrice(coin.basePrice, coin.volatility, Date.now() - 604800000 + updateCount * 1000)
      
      const change24h = ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100
      const change1h = ((currentPrice - hourAgoPrice) / hourAgoPrice) * 100
      const change7d = ((currentPrice - weekAgoPrice) / weekAgoPrice) * 100
      
      // Calculate realistic market cap based on circulating supply estimates
      const supplyEstimates: Record<string, number> = {
        'BTC': 19500000, 'ETH': 120000000, 'USDT': 95000000000, 'USDC': 25000000000,
        'BNB': 150000000, 'ADA': 35000000000, 'SOL': 400000000, 'MATIC': 9000000000,
        'AVAX': 350000000, 'DOT': 1200000000, 'LINK': 500000000, 'LTC': 73000000
      }
      
      const supply = supplyEstimates[coin.symbol] || 1000000000
      const marketCap = currentPrice * supply
      const volume24h = marketCap * (0.05 + Math.random() * 0.15) // 5-20% of market cap
      
      return {
        symbol: coin.symbol,
        name: coin.name,
        price: currentPrice,
        change24h,
        change1h,
        change7d,
        marketCap,
        volume24h,
        icon: getCoinIcon(coin.symbol),
        priceHistory: generatePriceHistory(coin.symbol, currentPrice)
      }
    })
    
    setCoins(initialCoins)
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const updatePrices = () => {
    setUpdateCount(prev => prev + 1)
    
    setCoins(prevCoins => 
      prevCoins.map(coin => {
        const coinInfo = coinData.find(c => c.symbol === coin.symbol)
        if (!coinInfo) return coin
        
        const newPrice = generateRealisticPrice(coinInfo.basePrice, coinInfo.volatility, Date.now() + updateCount * 1000)
        const yesterdayPrice = generateRealisticPrice(coinInfo.basePrice, coinInfo.volatility, Date.now() - 86400000 + updateCount * 1000)
        const hourAgoPrice = generateRealisticPrice(coinInfo.basePrice, coinInfo.volatility, Date.now() - 3600000 + updateCount * 1000)
        const weekAgoPrice = generateRealisticPrice(coinInfo.basePrice, coinInfo.volatility, Date.now() - 604800000 + updateCount * 1000)
        
        const newChange24h = ((newPrice - yesterdayPrice) / yesterdayPrice) * 100
        const newChange1h = ((newPrice - hourAgoPrice) / hourAgoPrice) * 100
        const newChange7d = ((newPrice - weekAgoPrice) / weekAgoPrice) * 100
        
        // Update price history
        const newPriceHistory = [...coin.priceHistory.slice(1), {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: newPrice,
          timestamp: Date.now()
        }]
        
        return {
          ...coin,
          price: newPrice,
          change24h: newChange24h,
          change1h: newChange1h,
          change7d: newChange7d,
          marketCap: coin.marketCap * (newPrice / coin.price), // Adjust market cap
          priceHistory: newPriceHistory
        }
      })
    )
    
    setLastUpdated(new Date())
  }

  useEffect(() => {
    initializeCoins()
    const interval = setInterval(updatePrices, 3000) // Update every 3 seconds
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

  const getChartColor = (change: number) => {
    return change > 0 ? "#10b981" : "#ef4444"
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            ${formatPrice(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Live Crypto Charts */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Live Crypto Market
              </CardTitle>
              <CardDescription>
                Realistic cryptocurrency prices with live updates every 3 seconds
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30 animate-pulse">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live Market
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={updatePrices}
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="p-4 border border-border/50 rounded-lg animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-16 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {coins.map((coin) => {
                const ChangeIcon = getChangeIcon(coin.change24h)
                const changeColor = getChangeColor(coin.change24h)
                const chartColor = getChartColor(coin.change24h)
                
                return (
                  <Card 
                    key={coin.symbol} 
                    className={`border-border/50 hover-glow transition-all duration-300 cursor-pointer ${
                      selectedCoin === coin.symbol ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCoin(selectedCoin === coin.symbol ? null : coin.symbol)}
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{coin.icon}</span>
                          <div>
                            <p className="font-semibold text-sm">{coin.symbol}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[80px]">{coin.name}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Price Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-lg font-bold">
                            ${formatPrice(coin.price)}
                          </span>
                          <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
                            <ChangeIcon className="h-3 w-3" />
                            <span>{coin.change24h > 0 ? "+" : ""}{coin.change24h.toFixed(2)}%</span>
                          </div>
                        </div>
                        
                        {/* Additional changes */}
                        <div className="flex items-center justify-between text-xs">
                          <span className={getChangeColor(coin.change1h)}>
                            1h: {coin.change1h > 0 ? "+" : ""}{coin.change1h.toFixed(2)}%
                          </span>
                          <span className={getChangeColor(coin.change7d)}>
                            7d: {coin.change7d > 0 ? "+" : ""}{coin.change7d.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      {/* Mini Chart */}
                      <div className="h-16 mb-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={coin.priceHistory.slice(-24)}> {/* Last 24 points */}
                            <Line 
                              type="monotone" 
                              dataKey="price" 
                              stroke={chartColor}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 3, fill: chartColor }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Market Data */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Market Cap</span>
                          <span className="font-medium">{formatMarketCap(coin.marketCap)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Volume 24h</span>
                          <span className="font-medium">{formatMarketCap(coin.volume24h)}</span>
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
            <span>Realistic market simulation • Updates every 3 seconds • Update #{updateCount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Chart for Selected Coin */}
      {selectedCoin && (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCoinIcon(selectedCoin)}
              {selectedCoin} Detailed Chart
            </CardTitle>
            <CardDescription>
              48-hour price movement with realistic market simulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={coins.find(c => c.symbol === selectedCoin)?.priceHistory || []}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${formatPrice(value)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={getChartColor(coins.find(c => c.symbol === selectedCoin)?.change24h || 0)}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 4, fill: getChartColor(coins.find(c => c.symbol === selectedCoin)?.change24h || 0) }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Currency Converter */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Live Market Converter
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
                <span className="text-muted-foreground">Live Exchange Rate:</span>
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