"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Copy, 
  ExternalLink, 
  DollarSign, 
  Search, 
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  SortAsc,
  SortDesc,
  MoreHorizontal
} from "lucide-react"
import { useInvoices } from "@/hooks/use-invoices"
import { PayInvoiceDialog } from "@/components/pay-invoice-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdvancedInvoiceTableProps {
  userAddress: string
  onRefresh: () => void
}

type SortField = "id" | "amount" | "date" | "status" | "risk"
type SortDirection = "asc" | "desc"

export function AdvancedInvoiceTable({ userAddress, onRefresh }: AdvancedInvoiceTableProps) {
  const { invoices } = useInvoices()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  // Advanced filtering and sorting
  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.amount.toString().includes(searchTerm)
      
      const matchesStatus = filterStatus === "all" || invoice.status === filterStatus
      const matchesRisk = filterRisk === "all" || invoice.risk === filterRisk
      
      return matchesSearch && matchesStatus && matchesRisk
    })

    // Sort invoices
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === "amount") {
        aValue = parseFloat(a.amount)
        bValue = parseFloat(b.amount)
      } else if (sortField === "date") {
        aValue = new Date(a.date)
        bValue = new Date(b.date)
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [invoices, searchTerm, filterStatus, filterRisk, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

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

  const getStatusIcon = (status: string) => {
    return status === "paid" ? CheckCircle : Clock
  }

  const getRiskIcon = (risk: string) => {
    if (risk === "high") return AlertTriangle
    if (risk === "medium") return AlertTriangle
    return CheckCircle
  }

  const exportToCSV = () => {
    const headers = ["Invoice ID", "Payer", "Payee", "Amount", "Status", "Risk", "Date"]
    const csvContent = [
      headers.join(","),
      ...filteredAndSortedInvoices.map(invoice => [
        invoice.id,
        invoice.payer,
        invoice.payee,
        invoice.amount,
        invoice.status,
        invoice.risk,
        invoice.date
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "invoices.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Advanced Invoice Management
              </CardTitle>
              <CardDescription>
                {filteredAndSortedInvoices.length} of {invoices.length} invoices
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 px-3"
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="h-8 px-3"
                >
                  Cards
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-col lg:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices, addresses, amounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredAndSortedInvoices.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="inline-flex p-4 rounded-full bg-muted/50">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterRisk !== "all" 
                  ? "No invoices match your filters" 
                  : "No invoices found"}
              </p>
              {(searchTerm || filterStatus !== "all" || filterRisk !== "all") && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("")
                    setFilterStatus("all")
                    setFilterRisk("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : viewMode === "table" ? (
            /* Desktop Table View */
            <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-2">
                        Invoice ID
                        {sortField === "id" && (
                          sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Payer</TableHead>
                    <TableHead>Payee</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-2">
                        Amount
                        {sortField === "amount" && (
                          sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortField === "status" && (
                          sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("risk")}
                    >
                      <div className="flex items-center gap-2">
                        Risk
                        {sortField === "risk" && (
                          sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {sortField === "date" && (
                          sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedInvoices.map((invoice, index) => {
                    const StatusIcon = getStatusIcon(invoice.status)
                    const RiskIcon = getRiskIcon(invoice.risk)
                    
                    return (
                      <TableRow key={invoice.id} className="animate-fade-in hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            #{invoice.id}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                          <Badge variant="outline" className={`${getStatusBadge(invoice.status)} capitalize flex items-center gap-1 w-fit`}>
                            <StatusIcon className="h-3 w-3" />
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getRiskBadge(invoice.risk)} capitalize flex items-center gap-1 w-fit`}>
                            <RiskIcon className="h-3 w-3" />
                            {invoice.risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{invoice.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => copyToClipboard(invoice.id)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy ID
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View on Explorer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Mobile Cards View */
            <div className="space-y-4">
              {filteredAndSortedInvoices.map((invoice, index) => {
                const StatusIcon = getStatusIcon(invoice.status)
                const RiskIcon = getRiskIcon(invoice.risk)
                
                return (
                  <Card
                    key={invoice.id}
                    className="border-border/50 animate-fade-in hover-glow transition-all duration-300"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Invoice ID</p>
                          <p className="font-mono text-sm font-medium">#{invoice.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={`${getStatusBadge(invoice.status)} capitalize flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {invoice.status}
                          </Badge>
                          <Badge variant="outline" className={`${getRiskBadge(invoice.risk)} capitalize flex items-center gap-1`}>
                            <RiskIcon className="h-3 w-3" />
                            {invoice.risk}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-semibold text-lg">{invoice.amount} MNEE</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm">{invoice.date}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Payer</p>
                          <p className="font-mono text-xs bg-muted/50 p-2 rounded">{truncateAddress(invoice.payer)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Payee</p>
                          <p className="font-mono text-xs bg-muted/50 p-2 rounded">{truncateAddress(invoice.payee)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        {invoice.status === "pending" && invoice.payer.toLowerCase() === userAddress.toLowerCase() ? (
                          <Button
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={() => setSelectedInvoice(invoice.id)}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Pay Invoice
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" className="flex-1" onClick={() => copyToClipboard(invoice.id)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy ID
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
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