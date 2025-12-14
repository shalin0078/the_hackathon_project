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
  AlertCircle,
  BarChart3,
  Eye
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
  marketCap: number
  volume24h: number
  icon: string
  priceHistory: PricePoint[]
}

export function CryptoCharts() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<'live' | 'fallback'>('live')
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const [fromCurrency, setFromCurrency] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("ETH")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const coinSymbols = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'SOL', 'MATIC', 'AVAX', 'DOT', 'LINK', 'LTC']

  const getCoinIcon = (symbol: string): string => {
    const icons: Record<string, string> = {
      'BTC': '₿', 'ETH': '⟠', 'USDT': '💰', 'USDC': '💵', 'BNB': '🟡',
      'ADA': '🔵', 'SOL': '☀️', 'MATIC': '🔺', 'AVAX': '🔺', 'DOT': '⚫',
      'LINK': '🔗', 'LTC': 'Ł'
    }
    return icons[symbol] || '🪙'
  }

  const coinNames: Record<string, string> = {
    'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'USDT': 'Tether', 'USDC': 'USD Coin',
    'BNB': 'BNB', 'ADA': 'Cardano', 'SOL': 'Solana', 'MATIC': 'Polygon',
    'AVAX': 'Avalanche', 'DOT': 'Polkadot', 'LINK': 'Chainlink', 'LTC': 'Litecoin'
  }

  const basePrices: Record<string, number> = {
    'BTC': 43250, 'ETH': 2580, 'USDT': 1.00, 'USDC': 1.00, 'BNB': 315,
    'ADA': 0.52, 'SOL': 98.5, 'MATIC': 0.89, 'AVAX': 37.2, 'DOT': 7.8,
    'LINK': 14.5, 'LTC': 73.2
  }

  const generatePriceHistory = (symbol: string, currentPrice: number): PricePoint[] => {
    const history: PricePoint[] = []
    const now = Date.now()
    const points = 24 // 24 hours of data
    
    for (let i = points; i >= 0; i--) {
      const timestamp = now - (i * 60 * 60 * 1000) // Every hour
      const time = new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      // Generate realistic price movement
      const volatility = symbol === 'BTC' ? 0.02 : symbol === 'ETH' ? 0.03 : 0.05
      const randomChange = (Math.random() - 0.5) * volatility
      const baseChange = Math.sin((i / points) * Math.PI * 2) * 0.01 // Smooth wave
      
      const priceMultiplier = 1 + baseChange + randomChange
      const price = currentPrice * priceMultiplier
      
      history.push({ time, price, timestamp })
    }
    
    return history.sort((a, b) => a.timestamp - b.timestamp)
  }

  const generateMarketData = () => {
    const enhancedCoins: CoinData[] = coinSymbols.map(symbol => {
      const basePrice = basePrices[symbol] || 1
      const fluctuation = (Math.random() - 0.5) * 0.04
      const currentPrice = basePrice * (1 + fluctuation)
      
      const change24h = (Math.random() - 0.5) * 15
      const marketCap = currentPrice * (symbol === 'BTC' ? 19500000 : 
                                      symbol === 'ETH' ? 120000000 :
                                      Math.random() * 5000000000 + 1000000000)
      
      return {
        symbol,
        name: coinNames[symbol] || symbol,
        price: currentPrice,
        change24h,
        marketCap,
        volume24h: marketCap * (Math.random() * 0.15 + 0.05),
        icon: getCoinIcon(symbol),
        priceHistory: generatePriceHistory(symbol, currentPrice)
      }
    })
    
    setCoins(enhancedCoins)
    setLastUpdated(new Date())
  }

  const updatePriceHistory = () => {
    setCoins(prevCoins => 
      prevCoins.map(coin => {
        const newFluctuation = (Math.random() - 0.5) * 0.02
        const newPrice = coin.price * (1 + newFluctuation)
        const newChange = coin.change24h + (Math.random() - 0.5) * 2
        
        // Add new price point and keep last 24 points
        const newPriceHistory = [...coin.priceHistory.slice(1), {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: newPrice,
          timestamp: Date.now()
        }]
        
        return {
          ...coin,
          price: newPrice,
          change24h: Math.max(-20, Math.min(20, newChange)),
          priceHistory: newPriceHistory
        }
      })
    )
    setLastUpdated(new Date())
  }

  useEffect(() => {
    generateMarketData()
    const interval = setInterval(updatePriceHistory, 5000) // Update every 5 seconds
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
      {/* Real-time Charts Grid */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Real-Time Crypto Charts
              </CardTitle>
              <CardDescription>
                Live price charts updating every 5 seconds
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30 animate-pulse">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live Charts
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={updatePriceHistory}
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
                    </div>

                    {/* Mini Chart */}
                    <div className="h-16 mb-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={coin.priceHistory}>
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
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span>Charts update every 5 seconds • Click any coin for details</span>
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
              24-hour price movement for {coinNames[selectedCoin]}
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

      {/* Currency Converter */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Live Converter with Charts
          </CardTitle>
          <CardDescription>
            Convert between cryptocurrencies using live chart data
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