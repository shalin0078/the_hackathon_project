"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Brain, Shield, Zap } from "lucide-react"

export function AIAgentSection() {
  const features = [
    {
      icon: Brain,
      title: "Invoice Analysis",
      description: "AI analyzes invoice patterns and transaction history",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Real-time fraud detection and risk scoring",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      borderColor: "border-chart-4/20",
    },
    {
      icon: Zap,
      title: "Smart Payments",
      description: "Automated payment execution with human confirmation",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
  ]

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Payment Agent
        </CardTitle>
        <CardDescription>
          Autonomous invoice management with built-in risk awareness and fraud detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-4 rounded-lg bg-background/50 border border-border/50 space-y-3 animate-fade-in hover:border-border/80 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} border ${feature.borderColor}`}>
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50 space-y-2">
          <p className="text-sm font-medium">What the AI Agent Does</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Analyzes pending invoices for risk factors</li>
            <li>• Provides payment recommendations based on risk assessment</li>
            <li>• Requires human confirmation before executing payments</li>
            <li>• Monitors transaction patterns for unusual activity</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
