"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Zap, 
  Globe,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  Monitor,
  Lock,
  Key,
  Database,
  Wifi
} from "lucide-react"

interface SettingsConfig {
  // Security Settings
  autoLockTimeout: number
  requireConfirmation: boolean
  enableBiometric: boolean
  
  // Notification Settings
  emailNotifications: boolean
  pushNotifications: boolean
  riskAlerts: boolean
  paymentUpdates: boolean
  
  // AI Settings
  aiAutoAnalysis: boolean
  aiRiskThreshold: number
  aiAutoPayment: boolean
  aiMaxAmount: number
  
  // Display Settings
  theme: "light" | "dark" | "system"
  currency: string
  language: string
  compactMode: boolean
  
  // Advanced Settings
  gasOptimization: boolean
  batchProcessing: boolean
  customRpcUrl: string
  debugMode: boolean
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<SettingsConfig>({
    // Security
    autoLockTimeout: 15,
    requireConfirmation: true,
    enableBiometric: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    riskAlerts: true,
    paymentUpdates: true,
    
    // AI
    aiAutoAnalysis: true,
    aiRiskThreshold: 70,
    aiAutoPayment: false,
    aiMaxAmount: 50,
    
    // Display
    theme: "system",
    currency: "MNEE",
    language: "en",
    compactMode: false,
    
    // Advanced
    gasOptimization: true,
    batchProcessing: true,
    customRpcUrl: "",
    debugMode: false
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState<"security" | "notifications" | "ai" | "display" | "advanced">("security")

  const updateSetting = <K extends keyof SettingsConfig>(key: K, value: SettingsConfig[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    // Save to localStorage or API
    localStorage.setItem("app_settings", JSON.stringify(settings))
    setHasChanges(false)
    console.log("Settings saved:", settings)
  }

  const resetSettings = () => {
    // Reset to defaults
    setSettings({
      autoLockTimeout: 15,
      requireConfirmation: true,
      enableBiometric: false,
      emailNotifications: true,
      pushNotifications: true,
      riskAlerts: true,
      paymentUpdates: true,
      aiAutoAnalysis: true,
      aiRiskThreshold: 70,
      aiAutoPayment: false,
      aiMaxAmount: 50,
      theme: "system",
      currency: "MNEE",
      language: "en",
      compactMode: false,
      gasOptimization: true,
      batchProcessing: true,
      customRpcUrl: "",
      debugMode: false
    })
    setHasChanges(true)
  }

  const sections = [
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "ai", label: "AI Settings", icon: Zap },
    { id: "display", label: "Display", icon: Palette },
    { id: "advanced", label: "Advanced", icon: Settings }
  ]

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Customize your invoice automation experience
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="outline" className="bg-chart-4/20 text-chart-4 border-chart-4/30">
                  Unsaved Changes
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={resetSettings}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={saveSettings} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Settings Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(section.id as any)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {section.label}
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Security Settings */}
          {activeSection === "security" && (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and authentication options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-lock Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically lock the app after inactivity
                      </p>
                    </div>
                    <Select 
                      value={settings.autoLockTimeout.toString()} 
                      onValueChange={(value) => updateSetting("autoLockTimeout", parseInt(value))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Require Confirmation</Label>
                      <p className="text-sm text-muted-foreground">
                        Require confirmation for all transactions
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireConfirmation}
                      onCheckedChange={(checked) => updateSetting("requireConfirmation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Biometric Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableBiometric}
                      onCheckedChange={(checked) => updateSetting("enableBiometric", checked)}
                    />
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-primary">Security Recommendations</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enable all security features for maximum protection. Your private keys are never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeSection === "notifications" && (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Manage how you receive updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Risk Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for high-risk invoices
                      </p>
                    </div>
                    <Switch
                      checked={settings.riskAlerts}
                      onCheckedChange={(checked) => updateSetting("riskAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Payment Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for payment status changes
                      </p>
                    </div>
                    <Switch
                      checked={settings.paymentUpdates}
                      onCheckedChange={(checked) => updateSetting("paymentUpdates", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Settings */}
          {activeSection === "ai" && (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  AI Agent Settings
                </CardTitle>
                <CardDescription>
                  Configure AI automation and analysis features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto Analysis</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically analyze new invoices
                      </p>
                    </div>
                    <Switch
                      checked={settings.aiAutoAnalysis}
                      onCheckedChange={(checked) => updateSetting("aiAutoAnalysis", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Risk Threshold ({settings.aiRiskThreshold}%)</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimum risk score to trigger alerts
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.aiRiskThreshold}
                      onChange={(e) => updateSetting("aiRiskThreshold", parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto Payment</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically pay low-risk invoices
                      </p>
                    </div>
                    <Switch
                      checked={settings.aiAutoPayment}
                      onCheckedChange={(checked) => updateSetting("aiAutoPayment", checked)}
                    />
                  </div>

                  {settings.aiAutoPayment && (
                    <div className="space-y-2">
                      <Label>Max Auto Payment Amount</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={settings.aiMaxAmount}
                          onChange={(e) => updateSetting("aiMaxAmount", parseFloat(e.target.value))}
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">MNEE</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-chart-4/10 border border-chart-4/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-chart-4 mt-0.5" />
                    <div>
                      <p className="font-medium text-chart-4">AI Safety Notice</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        AI automation requires careful configuration. Always review settings and test with small amounts first.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Display Settings */}
          {activeSection === "display" && (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Display Settings
                </CardTitle>
                <CardDescription>
                  Customize the appearance and layout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={settings.theme} onValueChange={(value: any) => updateSetting("theme", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MNEE">🔷 MNEE</SelectItem>
                        <SelectItem value="ETH">⟠ Ethereum</SelectItem>
                        <SelectItem value="USDC">💵 USD Coin</SelectItem>
                        <SelectItem value="USDT">💰 Tether</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use smaller spacing and components
                      </p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => updateSetting("compactMode", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Advanced Settings */}
          {activeSection === "advanced" && (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Advanced configuration options for power users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Gas Optimization</Label>
                      <p className="text-sm text-muted-foreground">
                        Optimize transaction gas fees
                      </p>
                    </div>
                    <Switch
                      checked={settings.gasOptimization}
                      onCheckedChange={(checked) => updateSetting("gasOptimization", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Batch Processing</Label>
                      <p className="text-sm text-muted-foreground">
                        Process multiple transactions together
                      </p>
                    </div>
                    <Switch
                      checked={settings.batchProcessing}
                      onCheckedChange={(checked) => updateSetting("batchProcessing", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Custom RPC URL</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a custom blockchain RPC endpoint
                    </p>
                    <Input
                      placeholder="https://your-rpc-url.com"
                      value={settings.customRpcUrl}
                      onChange={(e) => updateSetting("customRpcUrl", e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable detailed logging and debugging
                      </p>
                    </div>
                    <Switch
                      checked={settings.debugMode}
                      onCheckedChange={(checked) => updateSetting("debugMode", checked)}
                    />
                  </div>
                </div>

                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Advanced Settings Warning</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        These settings are for advanced users only. Incorrect configuration may affect app functionality.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}