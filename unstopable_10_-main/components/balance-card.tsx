"use client"

import { useState, useEffect } from "react"
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface BalanceCardProps {
  address: string
}

export function BalanceCard({ address }: BalanceCardProps) {
  const [balance, setBalance] = useState("0.00")
  const [change, setChange] = useState("+0.00")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate balance fetch
    setTimeout(() => {
      setBalance("12,486.32")
      setChange("+234.56")
      setIsLoading(false)
    }, 500)
  }, [address])

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 backdrop-blur overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <CardContent className="p-6 relative">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span>MNEE Balance</span>
            </div>
            {isLoading ? (
              <div className="h-12 w-48 bg-muted/20 animate-pulse rounded" />
            ) : (
              <>
                <div className="space-y-1">
                  <div className="text-5xl font-bold tracking-tight animate-fade-in">${balance}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <ArrowUpRight className="h-4 w-4" />
                      {change}
                    </span>
                    <span className="text-sm text-muted-foreground">(+1.92%) today</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">$2,340.00</div>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary">Completed</span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">$45,789.50</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
