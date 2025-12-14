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
  DollarSign
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

export function MockMarketData() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fromCurrency, setFromCurrency] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("ETH")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Mock real-time data with realistic fluctuations
  const generateMockData = (): CoinData[] => {
    const baseData = [
      { symbol: "BTC", name: "Bitcoin", basePrice: 43250, icon: "₿" },
      { symbol: "ETH", name: "Ethereum", basePrice: 2580, icon: "⟠" },
      { symbol: "USDC", name: "USD Coin", basePrice: 1.00, icon: "💵" },
      { symbol: "USDT", name: "Tether", basePrice: 0.999, icon: "💰" },
      { symbol: "MATIC", name: "Polygon", basePrice: 0.89, icon: "🔺" },
      { symbol: "BNB", name: "BNB", basePrice: 315, icon: "🟡" },
      { symbol: "ADA", name: "Cardano", basePrice: 0.52, icon: "🔵" },
      { symbol: "SOL", name: "Solana", basePrice: 98.5, icon: "☀️" }
    ]

    return baseData.map(coin => {
      // Add realistic price fluctuation (±5%)
      const fluctuation = (Math.random() - 0.5) * 0.1
      const currentPrice = coin.basePrice * (1 + fluctuation)
      
      // Generate realistic 24h change (±15%)
      const change24h = (Math.random() - 0.5) * 30
      
      // Calculate market cap (mock)
      const marketCap = currentPrice * (Math.random() * 1000000000 + 100000000)
      
      // Calculate volume (mock)
      const volume24h = marketCap * (Math.random() * 0.1 + 0.05)

      return {
        symbol: coin.symbol,
        name: coin.name,
        price: currentPrice,
        change24h,
        marketCap,
        volume24h,
        icon: coin.icon
      }
    })
  }

  const updatePrices = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCoins(generateMockData())
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    updatePrices()
    const interval = setInterval(updatePrices, 10000) // Update every 10 seconds for demo
    return () => clearInterval(interval)
  }, [])

  // Convert between currencies
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const fromCoin = coins.find(c => c.symbol === fromCurrency)
      const toCoin = coins.find(c => c.symbol === toCurrency)
      
      if (fromCoin && toCoin) {
        const usdAmount = parseFloat(fromAmount) * fromCoin.price
        const convertedAmount = usdAmount / toCoin.price
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
      {/* Live Market Data */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Live Market Data (Demo)
              </CardTitle>
              <CardDescription>
                Simulated real-time cryptocurrency prices with live updates
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30 animate-pulse">
                Live Demo
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
          {isLoading && coins.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-4 border border-border/50 rounded-lg animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <p className="text-xs text-muted-foreground">{coin.name}</p>
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
                          <span className="text-sm text-muted-foreground">24h Change</span>
                          <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
                            <ChangeIcon className="h-3 w-3" />
                            <span>{coin.change24h > 0 ? "+" : ""}{coin.change24h.toFixed(2)}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Market Cap</span>
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
            <span>Demo data - Updates every 10 seconds</span>
          </div>
        </CardContent>
      </Card>

      {/* Live Currency Converter */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Live Currency Converter (Demo)
          </CardTitle>
          <CardDescription>
            Convert between cryptocurrencies using simulated live prices
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
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="font-mono">
                    1 {fromCurrency} = {formatPrice(parseFloat(toAmount) / parseFloat(fromAmount))} {toCurrency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Current prices:</span>
                  <span>
                    {fromCurrency}: ${formatPrice(coins.find(c => c.symbol === fromCurrency)?.price || 0)} | 
                    {toCurrency}: ${formatPrice(coins.find(c => c.symbol === toCurrency)?.price || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Coins className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-primary">Demo Mode Active</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This is simulated market data that updates every 10 seconds to demonstrate real-time functionality. 
                  In production, this would connect to live cryptocurrency APIs.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}