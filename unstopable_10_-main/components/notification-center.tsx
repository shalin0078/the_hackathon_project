"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  DollarSign,
  Clock,
  Shield,
  Zap,
  X,
  Settings,
  Filter
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useInvoices } from "@/hooks/use-invoices"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionable?: boolean
  invoiceId?: string
}

export function NotificationCenter() {
  const { invoices } = useInvoices()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "actionable">("all")

  // Generate notifications based on invoice data
  useEffect(() => {
    const newNotifications: Notification[] = []

    // Check for high-risk invoices
    const highRiskInvoices = invoices.filter(inv => inv.risk === "high" && inv.status === "pending")
    highRiskInvoices.forEach(invoice => {
      newNotifications.push({
        id: `risk-${invoice.id}`,
        type: "warning",
        title: "High Risk Invoice Detected",
        message: `Invoice #${invoice.id} has been flagged as high risk. Review before processing.`,
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
        read: false,
        actionable: true,
        invoiceId: invoice.id
      })
    })

    // Check for successful payments
    const paidInvoices = invoices.filter(inv => inv.status === "paid")
    paidInvoices.slice(0, 3).forEach(invoice => {
      newNotifications.push({
        id: `paid-${invoice.id}`,
        type: "success",
        title: "Payment Completed",
        message: `Invoice #${invoice.id} has been successfully paid (${invoice.amount} MNEE).`,
        timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time within last day
        read: Math.random() > 0.5,
        actionable: false,
        invoiceId: invoice.id
      })
    })

    // Check for pending invoices approaching deadline (mock)
    const pendingInvoices = invoices.filter(inv => inv.status === "pending")
    pendingInvoices.slice(0, 2).forEach(invoice => {
      newNotifications.push({
        id: `deadline-${invoice.id}`,
        type: "info",
        title: "Payment Reminder",
        message: `Invoice #${invoice.id} is due soon. Amount: ${invoice.amount} MNEE.`,
        timestamp: new Date(Date.now() - Math.random() * 7200000), // Random time within last 2 hours
        read: false,
        actionable: true,
        invoiceId: invoice.id
      })
    })

    // System notifications
    newNotifications.push(
      {
        id: "ai-analysis",
        type: "info",
        title: "AI Analysis Complete",
        message: "Risk assessment completed for all pending invoices. 2 high-risk items detected.",
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        read: false,
        actionable: false
      },
      {
        id: "blockchain-sync",
        type: "success",
        title: "Blockchain Sync Complete",
        message: "All transactions have been synchronized with the blockchain.",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: true,
        actionable: false
      }
    )

    // Sort by timestamp (newest first)
    newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    
    setNotifications(newNotifications)
  }, [invoices])

  const unreadCount = notifications.filter(n => !n.read).length
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read
    if (filter === "actionable") return notification.actionable
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return CheckCircle
      case "warning": return AlertTriangle
      case "error": return AlertTriangle
      default: return Info
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "text-chart-2"
      case "warning": return "text-chart-4"
      case "error": return "text-destructive"
      default: return "text-primary"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-96 p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilter("all")}>
                      All Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("unread")}>
                      Unread Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("actionable")}>
                      Actionable Items
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type)
                    const iconColor = getNotificationColor(notification.type)
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group ${
                          !notification.read ? "bg-primary/5" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-full bg-background border ${
                            !notification.read ? "border-primary/30" : "border-border"
                          }`}>
                            <Icon className={`h-3 w-3 ${iconColor}`} />
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium ${
                                !notification.read ? "text-foreground" : "text-muted-foreground"
                              }`}>
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1">
                                {notification.actionable && (
                                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                    Action
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeNotification(notification.id)
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                              
                              {notification.actionable && (
                                <Button variant="ghost" size="sm" className="h-6 text-xs">
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}