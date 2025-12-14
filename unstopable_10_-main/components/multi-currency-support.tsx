"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  ArrowUpDown,
  Coins,
  Globe,
  Calculator,
  AlertCircle
} from "lucide-react"

interface Currency {
  symbol: string
  name: string
  rate: number // Rate to MNEE
  change24h: number
  icon: string
}

interface CurrencyConverterProps {
  onCurrencyChange?: (currency: string, amount: number) => void
}

export function MultiCurrencySupport({ onCurrencyChange }: CurrencyConverterProps) {
  const [currencies] = useState<Currency[]>([
    { symbol: "MNEE", name: "MNEE Token", rate: 1, change24h: 0, icon: "🔷" },
    { symbol: "ETH", name: "Ethereum", rate: 0.0003, change24h: 2.5, icon: "⟠" },
    { symbol: "USDC", name: "USD Coin", rate: 1.2, change24h: 0.1, icon: "💵" },
    { symbol: "USDT", name: "Tether", rate: 1.19, change24h: -0.05, icon: "💰" },
    { symbol: "BTC", name: "Bitcoin", rate: 0.000012, change24h: 1.8, icon: "₿" },
    { symbol: "MATIC", name: "Polygon", rate: 2.1, change24h: -1.2, icon: "🔺" },
    { symbol: "BNB", name: "BNB", rate: 0.0018, change24h: 0.8, icon: "🟡" },
    { symbol: "ADA", name: "Cardano", rate: 3.2, change24h: -0.3, icon: "🔵" }
  ])

  const [fromCurrency, setFromCurrency] = useState("MNEE")
  const [toCurrency, setToCurrency] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isConverting, setIsConverting] = useState(false)

  // Convert between currencies
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const fromRate = currencies.find(c => c.symbol === fromCurrency)?.rate || 1
      const toRate = currencies.find(c => c.symbol === toCurrency)?.rate || 1
      
      // Convert to MNEE first, then to target currency
      const mneeAmount = parseFloat(fromAmount) / fromRate
      const convertedAmount = mneeAmount * toRate
      
      setToAmount(convertedAmount.toFixed(6))
      
      if (onCurrencyChange) {
        onCurrencyChange(toCurrency, convertedAmount)
      }
    } else {
      setToAmount("")
    }
  }, [fromAmount, fromCurrency, toCurrency, currencies, onCurrencyChange])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount(toAmount)
  }

  const refreshRates = () => {
    setIsConverting(true)
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsConverting(false)
    }, 1000)
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
      {/* Currency Converter */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Currency Converter
          </CardTitle>
          <CardDescription>
            Convert between supported cryptocurrencies and tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Currency */}
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
                    {currencies.map((currency) => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{currency.icon}</span>
                          <span>{currency.symbol}</span>
                          <span className="text-muted-foreground text-sm">
                            {currency.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button */}
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

            {/* To Currency */}
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
                    {currencies.map((currency) => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{currency.icon}</span>
                          <span>{currency.symbol}</span>
                          <span className="text-muted-foreground text-sm">
                            {currency.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          {fromAmount && toAmount && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate:</span>
                <span className="font-mono">
                  1 {fromCurrency} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toCurrency}
                </span>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshRates}
              disabled={isConverting}
              className="h-6 px-2"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isConverting ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Supported Currencies */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Supported Currencies
          </CardTitle>
          <CardDescription>
            Current exchange rates and 24h changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currencies.map((currency) => {
              const ChangeIcon = getChangeIcon(currency.change24h)
              const changeColor = getChangeColor(currency.change24h)
              
              return (
                <Card key={currency.symbol} className="border-border/50 hover-glow transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{currency.icon}</span>
                        <div>
                          <p className="font-semibold">{currency.symbol}</p>
                          <p className="text-xs text-muted-foreground">{currency.name}</p>
                        </div>
                      </div>
                      {currency.symbol === "MNEE" && (
                        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                          Native
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rate (MNEE)</span>
                        <span className="font-mono text-sm">{currency.rate}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">24h Change</span>
                        <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
                          <ChangeIcon className="h-3 w-3" />
                          <span>{currency.change24h > 0 ? "+" : ""}{currency.change24h}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Multi-Currency Invoice Creation */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Multi-Currency Invoicing
          </CardTitle>
          <CardDescription>
            Create invoices in any supported currency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-primary">Multi-Currency Support</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You can now create invoices in any supported cryptocurrency. The system will automatically 
                  handle conversions and display amounts in both the original currency and MNEE equivalent.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {currencies.slice(0, 6).map((currency) => (
                    <Badge key={currency.symbol} variant="outline" className="text-xs">
                      {currency.icon} {currency.symbol}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{currencies.length - 6} more
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}