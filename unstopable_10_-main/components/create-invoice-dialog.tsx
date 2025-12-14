"use client"

import { useState } from "react"
import { DollarSign, User, FileText, Loader2, Upload, AlertTriangle, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useInvoices } from "@/hooks/use-invoices"
import { TransactionModal } from "@/components/transaction-modal"
import { SimplePDFParser } from "@/lib/pdf-parser-simple"
import { advancedAIEngine, InvoiceData, RiskAnalysis } from "@/lib/ai-engine-advanced"
import { blockchainService } from "@/lib/blockchain"

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateInvoiceDialog({ open, onOpenChange, onSuccess }: CreateInvoiceDialogProps) {
  const [formData, setFormData] = useState<InvoiceData>({
    payee: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split('T')[0],
  })
  const [processing, setProcessing] = useState({
    step: 'idle' as 'idle' | 'parsing' | 'analyzing' | 'submitting' | 'complete',
    progress: 0,
    message: ''
  })
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showTxModal, setShowTxModal] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [invoiceId, setInvoiceId] = useState("")
  const { addInvoice } = useInvoices()
  const pdfParser = new SimplePDFParser()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setProcessing({ step: 'parsing', progress: 25, message: 'Parsing document...' })

    try {
      let parsedData: InvoiceData
      
      if (selectedFile.type === 'application/pdf') {
        parsedData = await pdfParser.parseInvoice(selectedFile)
      } else {
        const text = await selectedFile.text()
        parsedData = pdfParser.parseTextInput(text)
      }

      setFormData(parsedData)
      setProcessing({ step: 'analyzing', progress: 50, message: 'Analyzing with AI...' })
      
      const analysis = await advancedAIEngine.analyzeInvoiceRisk(parsedData)
      setRiskAnalysis(analysis)
      setShowAnalysis(true)
      
      setProcessing({ step: 'idle', progress: 100, message: 'Analysis complete' })
    } catch (error) {
      console.error('File processing failed:', error)
      setProcessing({ step: 'idle', progress: 0, message: 'Failed to process file' })
    }
  }

  const handleManualAnalysis = async () => {
    if (!formData.payee || !formData.amount) {
      alert('Please fill in payee and amount fields')
      return
    }

    setProcessing({ step: 'analyzing', progress: 30, message: 'Analyzing invoice data...' })
    
    try {
      // Simulate analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      setProcessing({ step: 'analyzing', progress: 60, message: 'Calculating risk score...' })
      
      const analysis = await advancedAIEngine.analyzeInvoiceRisk(formData)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      setProcessing({ step: 'analyzing', progress: 90, message: 'Generating recommendations...' })
      
      await new Promise(resolve => setTimeout(resolve, 200))
      
      console.log('AI Analysis Result:', analysis)
      setRiskAnalysis(analysis)
      setShowAnalysis(true)
      setProcessing({ step: 'idle', progress: 100, message: 'Analysis complete!' })
    } catch (error) {
      console.error('Analysis failed:', error)
      setProcessing({ step: 'idle', progress: 0, message: 'Analysis failed' })
    }
  }

  const handleSubmitToBlockchain = async () => {
    if (!riskAnalysis) return

    setProcessing({ step: 'submitting', progress: 75, message: 'Waiting for wallet confirmation...' })
    
    try {
      await blockchainService.connect()
      const invoiceHash = await blockchainService.submitInvoice(formData, riskAnalysis.riskScore)
      
      const newInvoiceId = invoiceHash.slice(0, 10)
      addInvoice({
        id: newInvoiceId,
        payer: formData.payee,
        payee: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        amount: formData.amount.toString(),
        status: "pending",
        risk: riskAnalysis.riskScore > 70 ? "high" : riskAnalysis.riskScore > 40 ? "medium" : "low",
        date: formData.date,
        description: formData.description,
        txHash: invoiceHash,
      })
      
      setInvoiceId(newInvoiceId)
      setTxHash(invoiceHash)
      setProcessing({ step: 'complete', progress: 100, message: 'Invoice submitted successfully!' })
      
      setTimeout(() => {
        onOpenChange(false)
        setShowTxModal(true)
        resetForm()
      }, 2000)
    } catch (error: any) {
      console.error('Blockchain submission failed:', error)
      
      let errorMessage = 'Blockchain submission failed'
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = 'Transaction cancelled - You rejected the wallet signature'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setProcessing({ step: 'idle', progress: 0, message: errorMessage })
    }
  }

  const resetForm = () => {
    setFormData({ payee: "", amount: 0, description: "", date: new Date().toISOString().split('T')[0] })
    setRiskAnalysis(null)
    setShowAnalysis(false)
    setProcessing({ step: 'idle', progress: 0, message: '' })
  }

  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr)
  }

  const getRiskColor = (score: number) => {
    if (score > 70) return 'text-red-600'
    if (score > 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI-Powered Invoice Processing</DialogTitle>
            <DialogDescription>Upload a PDF/text file or enter invoice details manually. AI will analyze for risks and anomalies.</DialogDescription>
          </DialogHeader>
          
          {processing.step !== 'idle' && (
            <div className="space-y-2">
              <Progress value={processing.progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{processing.message}</p>
            </div>
          )}

          <div className="space-y-4 py-4">
            {/* File Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="file">Upload Invoice (PDF/Text)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="cursor-pointer"
                disabled={processing.step !== 'idle'}
              />
              <p className="text-xs text-muted-foreground">
                Upload PDF or text file for automatic data extraction
              </p>
            </div>

            {/* Manual Input Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payee" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Payee/Vendor
                </Label>
                <Input
                  id="payee"
                  value={formData.payee}
                  onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
                  placeholder="Enter payee name"
                  disabled={processing.step !== 'idle'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Amount ($)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  disabled={processing.step !== 'idle'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Invoice description or reference"
                disabled={processing.step !== 'idle'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={processing.step !== 'idle'}
              />
            </div>

            {/* AI Analysis Results */}
            {showAnalysis && riskAnalysis && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold">AI Risk Analysis</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Risk Score</p>
                    <p className={`text-2xl font-bold ${getRiskColor(riskAnalysis.riskScore)}`}>
                      {riskAnalysis.riskScore}/100
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Recommendation</p>
                    <p className="text-sm">{riskAnalysis.recommendations[0]}</p>
                  </div>
                </div>

                {riskAnalysis.anomalies.length > 0 && (
                  <Alert variant={riskAnalysis.riskScore > 70 ? "destructive" : "default"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>⚠️ Detected Issues:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {riskAnalysis.anomalies.map((anomaly, index) => (
                          <li key={index} className="text-sm">{anomaly}</li>
                        ))}
                      </ul>
                      {riskAnalysis.riskScore > 70 && (
                        <p className="mt-2 text-sm font-bold">⛔ HIGH RISK: This invoice may contain false or fraudulent data. Verify carefully before submitting!</p>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">AI Explanation:</p>
                  <p className="whitespace-pre-line">{riskAnalysis.explanation}</p>
                </div>
                
                {riskAnalysis.riskScore > 70 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>⚠️ FRAUD WARNING:</strong> The AI has detected potential false or fraudulent data. Your wallet (MetaMask/OKX) may reject this transaction for your protection. Review all details carefully!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!showAnalysis ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                  disabled={processing.step !== 'idle'}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleManualAnalysis} 
                  disabled={processing.step !== 'idle' || !formData.payee || !formData.amount}
                  className="flex-1 gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Analyze with AI
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAnalysis(false)}
                  disabled={processing.step !== 'idle'}
                  className="flex-1"
                >
                  Edit Invoice
                </Button>
                <Button 
                  onClick={handleSubmitToBlockchain}
                  disabled={processing.step !== 'idle'}
                  className="flex-1 gap-2"
                >
                  {processing.step === 'complete' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Submit to Blockchain
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <TransactionModal
        open={showTxModal}
        onOpenChange={setShowTxModal}
        txHash={txHash}
        type="create"
        invoiceId={invoiceId}
      />
    </>
  )
}
