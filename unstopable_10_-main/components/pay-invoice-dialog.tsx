"use client"

import { useState } from "react"
import { DollarSign, Loader2, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useInvoices } from "@/hooks/use-invoices"
import { TransactionModal } from "@/components/transaction-modal"

interface PayInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: any
  onSuccess: () => void
}

export function PayInvoiceDialog({ open, onOpenChange, invoice, onSuccess }: PayInvoiceDialogProps) {
  const [step, setStep] = useState<"confirm" | "approving" | "paying">("confirm")
  const [showTxModal, setShowTxModal] = useState(false)
  const [txHash, setTxHash] = useState("")
  const { updateInvoiceStatus } = useInvoices()

  const handlePay = async () => {
    // Step 1: Approve MNEE token
    setStep("approving")
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Step 2: Pay invoice
    setStep("paying")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate transaction hash
    const hash = "0x" + Math.random().toString(16).substring(2, 66)
    setTxHash(hash)

    // Update invoice status
    updateInvoiceStatus(invoice.id, "paid")
    onSuccess()

    setStep("confirm")
    onOpenChange(false)
    setTimeout(() => {
      setShowTxModal(true)
    }, 100)
  }

  const handleClose = () => {
    setStep("confirm")
    onOpenChange(false)
  }

  if (!invoice) return null

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {step === "approving" || step === "paying" ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="inline-flex p-4 rounded-full bg-primary/20 border border-primary/30">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <DialogTitle>{step === "approving" ? "Approving MNEE..." : "Processing Payment..."}</DialogTitle>
                <DialogDescription>
                  {step === "approving"
                    ? "Please confirm the token approval in MetaMask"
                    : "Please confirm the payment transaction in MetaMask"}
                </DialogDescription>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: step === "approving" ? "50%" : "100%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Step {step === "approving" ? "1" : "2"} of 2</p>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Pay Invoice</DialogTitle>
                <DialogDescription>Review the invoice details before payment</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {invoice.risk === "high" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      High risk invoice detected. Please verify the recipient before proceeding.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Invoice ID</span>
                    <span className="text-sm font-mono">#{invoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm font-semibold">{invoice.amount} MNEE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payee</span>
                    <span className="text-sm font-mono">{invoice.payee.substring(0, 10)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <span
                      className={`text-sm font-medium capitalize ${
                        invoice.risk === "high"
                          ? "text-destructive"
                          : invoice.risk === "medium"
                            ? "text-chart-4"
                            : "text-chart-2"
                      }`}
                    >
                      {invoice.risk}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                  <p className="text-sm font-medium">Payment Flow</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>1. Approve MNEE token spending</p>
                    <p>2. Execute escrow payment</p>
                    <p>3. Funds transferred to payee</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handlePay} className="flex-1 bg-primary hover:bg-primary/90">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pay {invoice.amount} MNEE
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <TransactionModal
        open={showTxModal}
        onOpenChange={setShowTxModal}
        txHash={txHash}
        type="pay"
        invoiceId={invoice?.id}
      />
    </>
  )
}
