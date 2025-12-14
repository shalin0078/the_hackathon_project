"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react"
import { useInvoices } from "@/hooks/use-invoices"

interface DashboardCardsProps {
  balance: string
}

export function DashboardCards({ balance }: DashboardCardsProps) {
  const { invoices } = useInvoices()

  const stats = {
    total: invoices.length,
    pending: invoices.filter((inv) => inv.status === "pending").length,
    paid: invoices.filter((inv) => inv.status === "paid").length,
    totalProcessed: invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + Number.parseFloat(inv.amount), 0)
      .toFixed(2),
  }

  const cards = [
    {
      title: "MNEE Balance",
      value: `${balance} MNEE`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      title: "Total Invoices",
      value: stats.total.toString(),
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      title: "Pending",
      value: stats.pending.toString(),
      icon: Clock,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      borderColor: "border-chart-4/20",
    },
    {
      title: "Paid",
      value: stats.paid.toString(),
      icon: CheckCircle,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      borderColor: "border-chart-2/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="border-border/50 bg-card/50 backdrop-blur overflow-hidden animate-fade-in hover:border-border/80 transition-all duration-300"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor} border ${card.borderColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
