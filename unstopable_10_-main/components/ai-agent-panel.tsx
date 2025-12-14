"use client"

import { useState } from "react"
import { Sparkles, Play, Pause, Settings, Activity, Brain } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function AIAgentPanel() {
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleToggle = () => {
    setIsActive(!isActive)
    if (!isActive) {
      // Simulate AI processing
      let current = 0
      const interval = setInterval(() => {
        current += 10
        setProgress(current)
        if (current >= 100) {
          clearInterval(interval)
          setProgress(0)
        }
      }, 500)
    } else {
      setProgress(0)
    }
  }

  return (
    <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5 backdrop-blur overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
              <Brain className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Finance Agent
                <Badge variant={isActive ? "default" : "secondary"} className="ml-2">
                  {isActive ? (
                    <>
                      <Activity className="h-3 w-3 mr-1 animate-pulse-glow" />
                      Active
                    </>
                  ) : (
                    "Idle"
                  )}
                </Badge>
              </CardTitle>
              <CardDescription>Autonomous payment management and decision-making</CardDescription>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleToggle}
              className={isActive ? "bg-destructive hover:bg-destructive/90" : "bg-accent hover:bg-accent/90"}
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Agent
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Agent
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {isActive && progress > 0 && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Processing invoices...</span>
              <span className="text-accent font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Decisions Made</span>
            </div>
            <div className="text-3xl font-bold">47</div>
            <div className="text-xs text-muted-foreground">Last 24 hours</div>
          </div>

          <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Auto-Payments</span>
            </div>
            <div className="text-3xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">$3,450 MNEE processed</div>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
            <div className="flex items-center gap-2 text-sm text-accent">
              <Brain className="h-4 w-4" />
              <span>Efficiency</span>
            </div>
            <div className="text-3xl font-bold">98.5%</div>
            <div className="text-xs text-muted-foreground">Cost savings achieved</div>
          </div>
        </div>

        {isActive && (
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-accent mt-0.5 animate-pulse-glow" />
              <div className="flex-1 space-y-1">
                <div className="font-semibold text-sm">Agent Activity</div>
                <div className="text-sm text-muted-foreground">
                  Analyzing 3 pending invoices. Invoice #1247 is due tomorrow - recommending auto-payment of $450 MNEE
                  to maintain business relationships.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
