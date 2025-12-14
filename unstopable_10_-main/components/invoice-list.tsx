"use client"

import { useState, useEffect } from "react"
import { Calendar, DollarSign, User, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Invoice {
  id: string
  payee: string
  amount: string
  status: "paid" | "pending" | "overdue"
  dueDate: string
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate invoice fetch
    setTimeout(() => {
      setInvoices([
        { id: "1247", payee: "0x742d35...3f2e", amount: "450.00", status: "pending", dueDate: "2024-12-15" },
        { id: "1246", payee: "0x8a9c12...7d4a", amount: "1,250.00", status: "paid", dueDate: "2024-12-10" },
        { id: "1245", payee: "0x5e7b3a...9c1f", amount: "890.50", status: "pending", dueDate: "2024-12-18" },
        { id: "1244", payee: "0x3c4d9e...2b8a", amount: "2,100.00", status: "overdue", dueDate: "2024-12-08" },
      ])
      setIsLoading(false)
    }, 300)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-primary" />
      case "pending":
        return <Clock className="h-4 w-4 text-accent" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No invoices yet. Create your first invoice to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice, index) => (
        <div
          key={invoice.id}
          className="p-4 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold">#{invoice.id}</span>
                <Badge variant={getStatusVariant(invoice.status)} className="flex items-center gap-1">
                  {getStatusIcon(invoice.status)}
                  {invoice.status}
                </Badge>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-mono truncate">{invoice.payee}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">${invoice.amount} MNEE</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due {invoice.dueDate}</span>
                </div>
              </div>
            </div>

            {invoice.status !== "paid" && (
              <Button size="sm" variant={invoice.status === "overdue" ? "destructive" : "default"} className="shrink-0">
                Pay Now
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
