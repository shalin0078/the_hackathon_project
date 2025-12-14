"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface KYAModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
}

export function KYAModal({ open, onOpenChange, onAccept }: KYAModalProps) {
  const [accepted, setAccepted] = useState(false)

  const capabilities = [
    { icon: CheckCircle, text: "Analyze invoice risk and fraud patterns using AI", color: "text-chart-2" },
    { icon: CheckCircle, text: "Extract data from PDF invoices automatically", color: "text-chart-2" },
    { icon: CheckCircle, text: "Simulate cash flow impact of payments", color: "text-chart-2" },
    { icon: CheckCircle, text: "Provide plain-language explanations of risks", color: "text-chart-2" },
    { icon: CheckCircle, text: "Store invoice metadata on blockchain for transparency", color: "text-chart-2" },
    { icon: CheckCircle, text: "Detect anomalies in payment patterns", color: "text-chart-2" },
  ]

  const limitations = [
    { icon: XCircle, text: "Cannot execute payments without explicit user approval", color: "text-destructive" },
    { icon: XCircle, text: "Cannot access private keys or wallet funds directly", color: "text-destructive" },
    { icon: XCircle, text: "Cannot make autonomous financial decisions", color: "text-destructive" },
    { icon: XCircle, text: "Does not provide financial, legal, or investment advice", color: "text-destructive" },
    { icon: XCircle, text: "AI analysis is advisory only - human oversight required", color: "text-destructive" },
    { icon: XCircle, text: "Cannot guarantee 100% accuracy in fraud detection", color: "text-destructive" },
  ]

  const handleAccept = () => {
    if (accepted) {
      onAccept()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>Know Your Agent (KYA)</DialogTitle>
              <DialogDescription>Understand what the AI agent can and cannot do</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-chart-2" />
              <h3 className="font-semibold">What the AI Agent Can Do</h3>
            </div>
            <div className="space-y-2 pl-7">
              {capabilities.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <item.icon className={`h-4 w-4 mt-0.5 ${item.color} flex-shrink-0`} />
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold">What the AI Agent Cannot Do</h3>
            </div>
            <div className="space-y-2 pl-7">
              {limitations.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <item.icon className={`h-4 w-4 mt-0.5 ${item.color} flex-shrink-0`} />
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-chart-4/10 border border-chart-4/20 flex gap-3">
            <AlertCircle className="h-5 w-5 text-chart-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Critical Safety Notice</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This AI system operates with human-in-the-loop enforcement. All blockchain transactions require your wallet signature. 
                The AI provides analysis and recommendations only - it cannot and will not execute any autonomous actions. 
                You maintain complete control over all financial decisions and transactions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-background">
            <Checkbox id="accept" checked={accepted} onCheckedChange={(checked) => setAccepted(checked === true)} />
            <Label htmlFor="accept" className="text-sm leading-relaxed cursor-pointer">
              I understand the AI agent's capabilities and limitations. I acknowledge that:
              <br />• All payments require my explicit wallet signature
              <br />• AI analysis is advisory only and requires human oversight
              <br />• I maintain full control over my funds and financial decisions
              <br />• The system cannot perform autonomous actions
            </Label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleAccept} disabled={!accepted} className="flex-1 bg-primary hover:bg-primary/90">
            Accept & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
