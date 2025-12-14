"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Copy, ExternalLink, DollarSign } from "lucide-react"
import { useInvoices } from "@/hooks/use-invoices"
import { PayInvoiceDialog } from "@/components/pay-invoice-dialog"

interface InvoiceTableProps {
  userAddress: string
  onRefresh: () => void
}

export function InvoiceTable({ userAddress, onRefresh }: InvoiceTableProps) {
  const { invoices } = useInvoices()
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  const filteredInvoices = invoices.filter((inv) => (filterStatus === "all" ? true : inv.status === filterStatus))

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: "bg-chart-2/20 text-chart-2 border-chart-2/30",
      medium: "bg-chart-4/20 text-chart-4 border-chart-4/30",
      high: "bg-destructive/20 text-destructive border-destructive/30",
    }
    return variants[risk as keyof typeof variants] || variants.low
  }

  const getStatusBadge = (status: string) => {
    return status === "paid"
      ? "bg-chart-2/20 text-chart-2 border-chart-2/30"
      : "bg-chart-4/20 text-chart-4 border-chart-4/30"
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Invoice Management
              </CardTitle>
              <CardDescription>View and manage all your invoices</CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="inline-flex p-4 rounded-full bg-muted/50">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Payer</TableHead>
                      <TableHead>Payee</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="animate-fade-in">
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            #{invoice.id}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(invoice.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{truncateAddress(invoice.payer)}</TableCell>
                        <TableCell className="font-mono text-sm">{truncateAddress(invoice.payee)}</TableCell>
                        <TableCell className="font-semibold">{invoice.amount} MNEE</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getStatusBadge(invoice.status)} capitalize`}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getRiskBadge(invoice.risk)} capitalize`}>
                            {invoice.risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{invoice.date}</TableCell>
                        <TableCell className="text-right">
                          {invoice.status === "pending" && invoice.payer.toLowerCase() === userAddress.toLowerCase() ? (
                            <Button
                              size="sm"
                              onClick={() => setSelectedInvoice(invoice.id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredInvoices.map((invoice, index) => (
                  <Card
                    key={invoice.id}
                    className="border-border/50 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Invoice ID</p>
                          <p className="font-mono text-sm">#{invoice.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={`${getStatusBadge(invoice.status)} capitalize`}>
                            {invoice.status}
                          </Badge>
                          <Badge variant="outline" className={`${getRiskBadge(invoice.risk)} capitalize`}>
                            {invoice.risk}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-semibold">{invoice.amount} MNEE</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm">{invoice.date}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Payer</p>
                          <p className="font-mono text-xs">{truncateAddress(invoice.payer)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Payee</p>
                          <p className="font-mono text-xs">{truncateAddress(invoice.payee)}</p>
                        </div>
                      </div>

                      {invoice.status === "pending" && invoice.payer.toLowerCase() === userAddress.toLowerCase() && (
                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() => setSelectedInvoice(invoice.id)}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Pay Invoice
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <PayInvoiceDialog
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
        invoice={invoices.find((inv) => inv.id === selectedInvoice)}
        onSuccess={onRefresh}
      />
    </>
  )
}
