"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface TransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  txHash: string
  type: "create" | "pay"
  invoiceId?: string
}

export function TransactionModal({ open, onOpenChange, txHash, type, invoiceId }: TransactionModalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const contractAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  const tokenAddress = "0x1234567890123456789012345678901234567890"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-chart-2/20 border border-chart-2/30 animate-fade-in">
              <CheckCircle2 className="h-8 w-8 text-chart-2" />
            </div>
          </div>
          <DialogTitle className="text-center">Transaction Successful</DialogTitle>
          <DialogDescription className="text-center">
            {type === "create" ? "Your invoice has been created on-chain" : "Payment has been processed through escrow"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {invoiceId && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Invoice ID</p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                <code className="text-xs font-mono flex-1 truncate">{invoiceId}</code>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => copyToClipboard(invoiceId)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Transaction Hash</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <code className="text-xs font-mono flex-1 truncate">{txHash}</code>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => copyToClipboard(txHash)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Contract Address</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <code className="text-xs font-mono flex-1 truncate">{contractAddress}</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => copyToClipboard(contractAddress)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Token Address (MNEE)</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <code className="text-xs font-mono flex-1 truncate">{tokenAddress}</code>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => copyToClipboard(tokenAddress)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => window.open("#", "_blank")}>
            <ExternalLink className="h-4 w-4" />
            View on Block Explorer
          </Button>

          {copied && <p className="text-xs text-center text-chart-2 animate-fade-in">Copied to clipboard!</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
