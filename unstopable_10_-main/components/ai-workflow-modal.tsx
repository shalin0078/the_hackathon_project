"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Shield, Zap, CheckCircle2, AlertTriangle } from "lucide-react"

interface AIWorkflowModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  invoiceCount: number
}

export function AIWorkflowModal({ open, onOpenChange, onConfirm, invoiceCount }: AIWorkflowModalProps) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [analysis, setAnalysis] = useState({
    totalInvoices: invoiceCount,
    lowRisk: Math.floor(invoiceCount * 0.7),
    mediumRisk: Math.floor(invoiceCount * 0.2),
    highRisk: Math.floor(invoiceCount * 0.1),
    recommended: Math.floor(invoiceCount * 0.7),
  })

  const steps = [
    {
      icon: Brain,
      title: "Analyzing Invoices",
      description: "Reviewing invoice patterns and transaction history",
      color: "text-accent",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Evaluating fraud indicators and risk factors",
      color: "text-chart-4",
    },
    {
      icon: Zap,
      title: "Payment Recommendation",
      description: "Generating optimized payment strategy",
      color: "text-primary",
    },
  ]

  useEffect(() => {
    if (!open) {
      setStep(0)
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    return () => clearInterval(interval)
  }, [open])

  useEffect(() => {
    if (progress === 100 && step < 2) {
      setTimeout(() => {
        setStep((prev) => prev + 1)
        setProgress(0)
      }, 500)
    }
  }, [progress, step])

  const isComplete = step === 2 && progress === 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Payment Agent</DialogTitle>
          <DialogDescription>Analyzing invoices and assessing payment risk</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workflow Steps */}
          <div className="space-y-4">
            {steps.map((s, index) => {
              const isActive = index === step
              const isCompleted = index < step

              return (
                <div
                  key={s.title}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 ${
                    isActive
                      ? "border-primary/50 bg-primary/5"
                      : isCompleted
                        ? "border-chart-2/50 bg-chart-2/5"
                        : "border-border/50 bg-muted/30"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg border ${
                      isActive
                        ? "bg-primary/10 border-primary/30"
                        : isCompleted
                          ? "bg-chart-2/10 border-chart-2/30"
                          : "bg-muted/50 border-border/50"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-chart-2" />
                    ) : (
                      <s.icon className={`h-5 w-5 ${isActive ? s.color : "text-muted-foreground"}`} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{s.title}</p>
                      {isCompleted && (
                        <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                          Complete
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                    {isActive && <Progress value={progress} className="h-1.5" />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Analysis Results */}
          {isComplete && (
            <div className="space-y-4 animate-slide-up">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-3">
                <p className="text-sm font-medium">Analysis Summary</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Invoices:</span>
                    <span className="font-semibold">{analysis.totalInvoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Low Risk:</span>
                    <span className="font-semibold text-chart-2">{analysis.lowRisk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medium Risk:</span>
                    <span className="font-semibold text-chart-4">{analysis.mediumRisk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">High Risk:</span>
                    <span className="font-semibold text-destructive">{analysis.highRisk}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 space-y-2">
                <div className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">AI Recommendation</p>
                    <p className="text-xs text-muted-foreground">
                      Approve payment for {analysis.recommended} low-risk invoices. Review {analysis.mediumRisk}{" "}
                      medium-risk invoices manually.
                    </p>
                  </div>
                </div>
              </div>

              {analysis.highRisk > 0 && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-destructive">Warning</p>
                      <p className="text-xs text-muted-foreground">
                        {analysis.highRisk} high-risk invoices detected. Manual review required before payment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
                  Review Manually
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={onConfirm}>
                  Proceed with Payment
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
