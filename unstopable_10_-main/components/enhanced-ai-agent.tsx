"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { 
  Zap, 
  Brain, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Bot,
  MessageSquare,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Eye,
  BarChart3,
  Lightbulb
} from "lucide-react"
import { useInvoices } from "@/hooks/use-invoices"

interface AIInsight {
  id: string
  type: "risk" | "optimization" | "prediction" | "recommendation"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high"
  actionable: boolean
}

interface AIAgentStatus {
  isActive: boolean
  currentTask: string
  progress: number
  lastUpdate: Date
  tasksCompleted: number
  insights: AIInsight[]
}

export function EnhancedAIAgent() {
  const { invoices } = useInvoices()
  const [agentStatus, setAgentStatus] = useState<AIAgentStatus>({
    isActive: false,
    currentTask: "Idle",
    progress: 0,
    lastUpdate: new Date(),
    tasksCompleted: 0,
    insights: []
  })
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: "user" | "ai", message: string, timestamp: Date}>>([])
  const [userMessage, setUserMessage] = useState("")
  const [showChat, setShowChat] = useState(false)

  // Simulate AI agent activity
  useEffect(() => {
    if (agentStatus.isActive) {
      const interval = setInterval(() => {
        setAgentStatus(prev => {
          const newProgress = Math.min(prev.progress + Math.random() * 15, 100)
          const isTaskComplete = newProgress >= 100
          
          return {
            ...prev,
            progress: isTaskComplete ? 0 : newProgress,
            tasksCompleted: isTaskComplete ? prev.tasksCompleted + 1 : prev.tasksCompleted,
            currentTask: isTaskComplete ? getNextTask() : prev.currentTask,
            lastUpdate: new Date()
          }
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [agentStatus.isActive])

  // Generate AI insights based on invoice data
  useEffect(() => {
    const insights: AIInsight[] = []

    // Risk analysis insights
    const highRiskCount = invoices.filter(inv => inv.risk === "high").length
    if (highRiskCount > 0) {
      insights.push({
        id: "risk-alert",
        type: "risk",
        title: "High Risk Invoices Detected",
        description: `${highRiskCount} invoice${highRiskCount > 1 ? 's' : ''} flagged as high risk. Consider manual review before processing.`,
        confidence: 95,
        impact: "high",
        actionable: true
      })
    }

    // Payment optimization
    const pendingValue = invoices
      .filter(inv => inv.status === "pending")
      .reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
    
    if (pendingValue > 100) {
      insights.push({
        id: "cash-flow",
        type: "optimization",
        title: "Cash Flow Optimization",
        description: `${pendingValue.toFixed(2)} MNEE in pending payments. Consider batch processing to reduce gas fees.`,
        confidence: 87,
        impact: "medium",
        actionable: true
      })
    }

    // Prediction insights
    const paymentRate = invoices.length > 0 ? (invoices.filter(inv => inv.status === "paid").length / invoices.length) * 100 : 0
    insights.push({
      id: "payment-prediction",
      type: "prediction",
      title: "Payment Success Rate",
      description: `Current payment rate: ${paymentRate.toFixed(1)}%. Predicted completion time for pending invoices: 2-3 days.`,
      confidence: 78,
      impact: "low",
      actionable: false
    })

    // Recommendations
    if (invoices.length > 5) {
      insights.push({
        id: "automation-rec",
        type: "recommendation",
        title: "Automation Opportunity",
        description: "Consider enabling auto-payment for low-risk invoices under 50 MNEE to improve efficiency.",
        confidence: 82,
        impact: "medium",
        actionable: true
      })
    }

    setAgentStatus(prev => ({ ...prev, insights }))
  }, [invoices])

  const getNextTask = () => {
    const tasks = [
      "Analyzing invoice risk patterns",
      "Optimizing payment routes",
      "Scanning for anomalies",
      "Updating risk models",
      "Processing payment queue",
      "Generating insights",
      "Monitoring blockchain activity"
    ]
    return tasks[Math.floor(Math.random() * tasks.length)]
  }

  const toggleAgent = () => {
    setAgentStatus(prev => ({
      ...prev,
      isActive: !prev.isActive,
      currentTask: !prev.isActive ? getNextTask() : "Idle",
      progress: 0
    }))
  }

  const resetAgent = () => {
    setAgentStatus(prev => ({
      ...prev,
      isActive: false,
      currentTask: "Idle",
      progress: 0,
      tasksCompleted: 0
    }))
  }

  const sendMessage = () => {
    if (!userMessage.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      message: userMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, newMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai" as const,
        message: generateAIResponse(userMessage),
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiResponse])
    }, 1000)

    setUserMessage("")
  }

  const generateAIResponse = (message: string) => {
    const responses = [
      "I've analyzed your request. Based on current invoice data, I recommend reviewing high-risk transactions first.",
      "The payment patterns suggest optimal processing during off-peak hours to minimize gas fees.",
      "I've identified potential optimization opportunities in your payment workflow. Would you like me to elaborate?",
      "Current risk assessment shows 2 invoices requiring manual review. Shall I prioritize these?",
      "Based on blockchain activity, I predict 95% success rate for pending low-risk payments."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "risk": return Shield
      case "optimization": return TrendingUp
      case "prediction": return BarChart3
      case "recommendation": return Lightbulb
      default: return Brain
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "risk": return "text-destructive"
      case "optimization": return "text-chart-2"
      case "prediction": return "text-primary"
      case "recommendation": return "text-chart-4"
      default: return "text-muted-foreground"
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high": return "bg-destructive/20 text-destructive border-destructive/30"
      case "medium": return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      case "low": return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      default: return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Agent Status */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${agentStatus.isActive ? "bg-primary/20 border-primary/30" : "bg-muted/20 border-muted/30"} border`}>
                <Bot className={`h-5 w-5 ${agentStatus.isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Payment Agent
                  <Badge variant={agentStatus.isActive ? "default" : "secondary"} className="text-xs">
                    {agentStatus.isActive ? "Active" : "Idle"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Autonomous invoice analysis and payment optimization
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAgent}
                disabled={agentStatus.isActive}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                onClick={toggleAgent}
                className={agentStatus.isActive ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}
              >
                {agentStatus.isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Agent Activity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Task:</span>
              <span className="font-medium">{agentStatus.currentTask}</span>
            </div>
            
            {agentStatus.isActive && (
              <div className="space-y-2">
                <Progress value={agentStatus.progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress: {Math.round(agentStatus.progress)}%</span>
                  <span>Tasks completed: {agentStatus.tasksCompleted}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-primary">{agentStatus.insights.length}</p>
              <p className="text-xs text-muted-foreground">Insights</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-chart-2">{agentStatus.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-chart-4">
                {agentStatus.insights.filter(i => i.actionable).length}
              </p>
              <p className="text-xs text-muted-foreground">Actions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      {showChat && (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              AI Assistant Chat
            </CardTitle>
            <CardDescription>
              Ask questions about your invoices and payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 border border-border/50 rounded-lg p-4 overflow-y-auto space-y-3 bg-muted/20">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Start a conversation with the AI agent</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border/50"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask the AI agent about your invoices..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <Button onClick={sendMessage} disabled={!userMessage.trim()}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Real-time analysis and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agentStatus.insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No insights available yet</p>
              <p className="text-sm">Start the AI agent to generate insights</p>
            </div>
          ) : (
            <div className="space-y-4">
              {agentStatus.insights.map((insight) => {
                const Icon = getInsightIcon(insight.type)
                const iconColor = getInsightColor(insight.type)
                
                return (
                  <div
                    key={insight.id}
                    className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-background border border-border/50">
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getImpactBadge(insight.impact)}>
                              {insight.impact} impact
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                                Actionable
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {insight.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Confidence: {insight.confidence}%</span>
                            <Progress value={insight.confidence} className="w-16 h-1" />
                          </div>
                          
                          {insight.actionable && (
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Review
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
        </CardContent>
      </Card>
    </div>
  )
}