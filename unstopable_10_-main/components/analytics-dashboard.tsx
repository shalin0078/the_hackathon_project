"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Clock, 
  Shield,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle
} from "lucide-react"
import { useInvoices } from "@/hooks/use-invoices"

interface AnalyticsDashboardProps {
  balance: string
}

export function AnalyticsDashboard({ balance }: AnalyticsDashboardProps) {
  const { invoices } = useInvoices()

  // Calculate analytics
  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter(inv => inv.status === "paid").length
  const pendingInvoices = invoices.filter(inv => inv.status === "pending").length
  const totalValue = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
  const paidValue = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
  const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0
  
  // Risk analysis
  const highRiskCount = invoices.filter(inv => inv.risk === "high").length
  const mediumRiskCount = invoices.filter(inv => inv.risk === "medium").length
  const lowRiskCount = invoices.filter(inv => inv.risk === "low").length
  
  // Monthly trends (mock data for demo)
  const monthlyGrowth = 12.5
  const avgProcessingTime = "2.3 days"
  
  const riskDistribution = [
    { label: "Low Risk", count: lowRiskCount, color: "bg-chart-2", percentage: totalInvoices > 0 ? (lowRiskCount / totalInvoices) * 100 : 0 },
    { label: "Medium Risk", count: mediumRiskCount, color: "bg-chart-4", percentage: totalInvoices > 0 ? (mediumRiskCount / totalInvoices) * 100 : 0 },
    { label: "High Risk", count: highRiskCount, color: "bg-destructive", percentage: totalInvoices > 0 ? (highRiskCount / totalInvoices) * 100 : 0 }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{paidValue.toFixed(2)} MNEE</p>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-chart-2" />
                  <span className="text-chart-2">+{monthlyGrowth}%</span>
                  <span className="text-muted-foreground">this month</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
                <DollarSign className="h-5 w-5 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Payment Rate</p>
                <p className="text-2xl font-bold">{paymentRate.toFixed(1)}%</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${paymentRate}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Processing</p>
                <p className="text-2xl font-bold">{avgProcessingTime}</p>
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3 text-chart-4" />
                  <span className="text-muted-foreground">faster than average</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-chart-4/10 border border-chart-4/20">
                <Activity className="h-5 w-5 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">
                  {highRiskCount > 0 ? "High" : mediumRiskCount > 0 ? "Medium" : "Low"}
                </p>
                <Badge 
                  variant="outline" 
                  className={`${highRiskCount > 0 ? "bg-destructive/20 text-destructive border-destructive/30" : 
                    mediumRiskCount > 0 ? "bg-chart-4/20 text-chart-4 border-chart-4/30" : 
                    "bg-chart-2/20 text-chart-2 border-chart-2/30"}`}
                >
                  {highRiskCount + mediumRiskCount} alerts
                </Badge>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <Shield className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Invoice risk analysis breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskDistribution.map((risk, index) => (
              <div key={risk.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                    <span>{risk.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{risk.count}</span>
                    <span className="text-muted-foreground">({risk.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <Progress value={risk.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Status Overview */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Payment Overview
            </CardTitle>
            <CardDescription>Current payment status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Paid Invoices</p>
                  <p className="text-2xl font-bold text-chart-2">{paidInvoices}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-lg font-semibold">{paidValue.toFixed(2)} MNEE</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Pending Invoices</p>
                  <p className="text-2xl font-bold text-chart-4">{pendingInvoices}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-lg font-semibold">{(totalValue - paidValue).toFixed(2)} MNEE</p>
                </div>
              </div>

              {highRiskCount > 0 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">
                      {highRiskCount} high-risk invoice{highRiskCount > 1 ? 's' : ''} require attention
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}