"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, FileText, Plus, Zap, DollarSign, Activity, BarChart3, Brain, Coins, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EnhancedWalletConnect } from "@/components/enhanced-wallet-connect"
import { DashboardCards } from "@/components/dashboard-cards"
import { AdvancedInvoiceTable } from "@/components/advanced-invoice-table"
import { CreateInvoiceDialog } from "@/components/create-invoice-dialog"
import { EnhancedAIAgent } from "@/components/enhanced-ai-agent"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { RealTimeCryptoMarket } from "@/components/real-time-crypto-market"
import { NotificationCenter } from "@/components/notification-center"
import { SettingsPanel } from "@/components/settings-panel"
import { KYAModal } from "@/components/kya-modal"
import { Footer } from "@/components/footer"
import { IPFSBanner } from "@/components/ipfs-banner"
import { AIWorkflowModal } from "@/components/ai-workflow-modal"
import { useWeb3 } from "@/hooks/use-web3"
import { useInvoices } from "@/hooks/use-invoices"

export default function Home() {
  const { isConnected, address, networkName, balance, isWrongNetwork, connect, disconnect, refreshBalance } = useWeb3()
  const { invoices } = useInvoices()
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [showKYA, setShowKYA] = useState(false)
  const [showAIWorkflow, setShowAIWorkflow] = useState(false)
  const [hasAcceptedKYA, setHasAcceptedKYA] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "invoices" | "ai" | "analytics" | "currencies" | "settings">("dashboard")

  useEffect(() => {
    const kyaAccepted = localStorage.getItem("kya_accepted")
    setHasAcceptedKYA(kyaAccepted === "true")
  }, [])

  const handleRunAIAgent = () => {
    if (!hasAcceptedKYA) {
      setShowKYA(true)
    } else {
      setShowAIWorkflow(true)
    }
  }

  const handleAIConfirm = () => {
    setShowAIWorkflow(false)
    console.log("[v0] AI agent payment confirmed")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <IPFSBanner />

      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-2.5 rounded-xl border border-primary/30">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Unstoppable Invoice Escrow</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Decentralized Payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            <EnhancedWalletConnect
              isConnected={isConnected}
              address={address}
              networkName={networkName}
              balance={balance}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </div>
      </header>

      {isConnected && isWrongNetwork && (
        <div className="container mx-auto px-4 pt-4">
          <Alert variant="destructive" className="animate-slide-down">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Wrong network detected. Please switch to the correct network in MetaMask.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="max-w-3xl mx-auto mt-20 text-center space-y-8 animate-slide-up">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow" />
              <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-8 rounded-2xl border border-primary/30">
                <Zap className="h-20 w-20 text-primary" />
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Decentralized Invoice Escrow
            </h2>

            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              A fully decentralized, AI-powered platform for creating, managing, and automating invoice payments with
              MNEE tokens. Built on blockchain, hosted on IPFS.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Smart Invoicing</h3>
                  <p className="text-sm text-muted-foreground">Create & manage invoices on-chain</p>
                </div>
              </div>

              <div
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Escrow Payments</h3>
                  <p className="text-sm text-muted-foreground">Secure MNEE token transfers</p>
                </div>
              </div>

              <div
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="p-3 rounded-lg bg-chart-4/10 border border-chart-4/20">
                  <Activity className="h-6 w-6 text-chart-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">AI Automation</h3>
                  <p className="text-sm text-muted-foreground">Risk analysis & smart payments</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                onClick={connect}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
              >
                Connect Wallet to Get Started
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg border border-border/50 backdrop-blur animate-slide-up">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "invoices" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("invoices")}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Invoices
              </Button>
              <Button
                variant={activeTab === "ai" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("ai")}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                AI Agent
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("analytics")}
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant={activeTab === "currencies" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("currencies")}
                className="flex items-center gap-2"
              >
                <Coins className="h-4 w-4" />
                Currencies
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("settings")}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <Button
                size="lg"
                onClick={() => setShowCreateInvoice(true)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Invoice
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleRunAIAgent}
                className="flex-1 border-accent/30 hover:bg-accent/10 hover:border-accent/50 bg-transparent"
              >
                <Zap className="h-5 w-5 mr-2 text-accent" />
                Run AI Payment Agent
              </Button>
            </div>

            {/* Tab Content */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <DashboardCards balance={balance} />
                  <AdvancedInvoiceTable userAddress={address} onRefresh={refreshBalance} />
                </div>
              )}
              
              {activeTab === "invoices" && (
                <AdvancedInvoiceTable userAddress={address} onRefresh={refreshBalance} />
              )}
              
              {activeTab === "ai" && (
                <EnhancedAIAgent />
              )}
              
              {activeTab === "analytics" && (
                <AnalyticsDashboard balance={balance} />
              )}
              
              {activeTab === "currencies" && (
                <RealTimeCryptoMarket />
              )}
              
              {activeTab === "settings" && (
                <SettingsPanel />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <CreateInvoiceDialog 
        open={showCreateInvoice} 
        onOpenChange={setShowCreateInvoice} 
        onSuccess={() => {
          refreshBalance()
          setActiveTab("invoices")
        }} 
      />

      <KYAModal
        open={showKYA}
        onOpenChange={setShowKYA}
        onAccept={() => {
          localStorage.setItem("kya_accepted", "true")
          setHasAcceptedKYA(true)
          setShowKYA(false)
          setShowAIWorkflow(true)
        }}
      />

      <AIWorkflowModal
        open={showAIWorkflow}
        onOpenChange={setShowAIWorkflow}
        onConfirm={handleAIConfirm}
        invoiceCount={invoices.filter((inv) => inv.status === "pending").length}
      />
    </div>
  )
}
