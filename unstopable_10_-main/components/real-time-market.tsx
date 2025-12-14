"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { marketDataService } from "@/lib/market-data"
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

interface MarketData {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap?: number
  volume24h?: number
  icon: string
}

export function RealTimeMarket() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fromCurrency, setFromCurrency] = useState("BTC")
  const [toCurrency, setToCurrency] = useState("ETH")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const getCoinIcon = (symbol: string): string => {
    const icons: Record<string, string> = {
      'BTC': '₿',
      'ETH': '⟠',
      'USDC': '💵',
      'USDT': '💰',
      'MATIC': '🔺',
      'BNB': '🟡',
      'ADA': '🔵',
      'SOL': '☀️',
      'DOT': '⚫',
      'AVAX': '🔺'
    }
    return icons[symbol] || '🪙'
  }

  const fetchMarketData = async () => {
    setIsLoading(true)
    try {
      const symbols = ['BTC', 'ETH', 'USDC', 'USDT', 'MATIC', 'BNB', 'ADA', 'SOL']
      const data = await marketDataService.getPrices(symbols)
      
      const formattedData: MarketData[] = data.map(item => ({
        symbol: item.symbol,
        name: item.name,
        price: item.price,
        change24h: item.change24h,
        marketCap: item.marketCap,
        volume24h: item.volume24h,
        icon: getCoinIcon(item.symbol)
      }))
      
      setMarketData(formattedData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch market data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Convert between currencies
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const fromCoin = marketData.find(c => c.symbol === fromCurrency)
      const toCoin = marketData.find(c => c.symbol === toCurrency)
      
      if (fromCoin && toCoin) {
        const usdAmount = parseFloat(fromAmount) * fromCoin.price
        const convertedAmount = usdAmount / toCoin.price
        setToAmount(marketDataService.formatPrice(convertedAmount))
      }
    } else {
      setToAmount("")
    }
  }, [fromAmount, fromCurrency, toCurrency, marketData])

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
                <Coins className="h-5 w-5 text-primary" />
                Live Market Data
              </CardTitle>
              <CardDescription>
                Real-time cryptocurrency prices from CoinGecko
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                Live
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchMarketData}
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
          {isLoading && marketData.length === 0 ? (
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
              {marketData.map((coin) => {
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
                            ${marketDataService.formatPrice(coin.price)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">24h Change</span>
                          <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
                            <ChangeIcon className="h-3 w-3" />
                            <span>{coin.change24h > 0 ? "+" : ""}{coin.change24h.toFixed(2)}%</span>
                          </div>
                        </div>
                        
                        {coin.marketCap && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Market Cap</span>
                            <span className="text-xs font-medium">
                              {marketDataService.formatMarketCap(coin.marketCap)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span>Data provided by CoinGecko</span>
          </div>
        </CardContent>
      </Card>

      {/* Live Currency Converter */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Live Currency Converter
          </CardTitle>
          <CardDescription>
            Convert between cryptocurrencies using real-time prices
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
                    {marketData.map((currency) => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{currency.icon}</span>
                          <span>{currency.symbol}</span>
                          <span className="text-muted-foreground text-sm">
                            ${marketDataService.formatPrice(currency.price)}
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
                    {marketData.map((currency) => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{currency.icon}</span>
                          <span>{currency.symbol}</span>
                          <span className="text-muted-foreground text-sm">
                            ${marketDataService.formatPrice(currency.price)}
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
                    1 {fromCurrency} = {marketDataService.formatPrice(parseFloat(toAmount) / parseFloat(fromAmount))} {toCurrency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Market prices:</span>
                  <span>
                    {fromCurrency}: ${marketDataService.formatPrice(marketData.find(c => c.symbol === fromCurrency)?.price || 0)} | 
                    {toCurrency}: ${marketDataService.formatPrice(marketData.find(c => c.symbol === toCurrency)?.price || 0)}
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