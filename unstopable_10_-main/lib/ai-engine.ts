export interface InvoiceData {
  amount: number;
  payee: string;
  date: string;
  description: string;
}

export interface RiskAnalysis {
  riskScore: number;
  anomalies: string[];
  recommendations: string[];
  explanation: string;
}

export interface CashFlowSimulation {
  currentBalance: number;
  projectedBalance: number;
  impact: number;
  recommendation: string;
}

class AIEngine {
  private classifier: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    if (typeof window === 'undefined') return;
    
    try {
      const { pipeline } = await import('@xenova/transformers');
      // Initialize lightweight classification model
      this.classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      this.initialized = true;
      console.log('AI Engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI Engine:', error);
    }
  }

  async analyzeInvoiceRisk(invoiceData: InvoiceData, historicalData: InvoiceData[] = []): Promise<RiskAnalysis> {
    await this.initialize();

    const anomalies: string[] = [];
    let riskScore = 0;

    // Amount anomaly detection
    if (historicalData.length > 0) {
      const avgAmount = historicalData.reduce((sum, inv) => sum + inv.amount, 0) / historicalData.length;
      const deviation = Math.abs(invoiceData.amount - avgAmount) / avgAmount;
      
      if (deviation > 2) {
        anomalies.push(`Amount ${invoiceData.amount} is ${(deviation * 100).toFixed(0)}% higher than average`);
        riskScore += 30;
      }
    }

    // Payee validation
    const knownPayees = historicalData.map(inv => inv.payee.toLowerCase());
    if (!knownPayees.includes(invoiceData.payee.toLowerCase()) && historicalData.length > 0) {
      anomalies.push('New payee detected');
      riskScore += 20;
    }

    // Date validation
    const invoiceDate = new Date(invoiceData.date);
    const now = new Date();
    const daysDiff = (now.getTime() - invoiceDate.getTime()) / (1000 * 3600 * 24);
    
    if (daysDiff > 90) {
      anomalies.push('Invoice is older than 90 days');
      riskScore += 15;
    }

    // Description analysis using AI
    if (this.classifier && invoiceData.description) {
      try {
        const sentiment = await this.classifier(invoiceData.description);
        if (sentiment[0].label === 'NEGATIVE' && sentiment[0].score > 0.8) {
          anomalies.push('Suspicious description detected');
          riskScore += 25;
        }
      } catch (error) {
        console.warn('Sentiment analysis failed:', error);
      }
    }

    const recommendations = this.generateRecommendations(riskScore, anomalies);
    const explanation = this.generateExplanation(invoiceData, riskScore, anomalies);

    return {
      riskScore: Math.min(riskScore, 100),
      anomalies,
      recommendations,
      explanation
    };
  }

  simulateCashFlow(invoiceAmount: number, currentBalance: number): CashFlowSimulation {
    const projectedBalance = currentBalance - invoiceAmount;
    const impact = (invoiceAmount / currentBalance) * 100;

    let recommendation = '';
    if (projectedBalance < 0) {
      recommendation = 'WARNING: Payment will result in negative balance';
    } else if (impact > 50) {
      recommendation = 'CAUTION: Payment represents significant portion of balance';
    } else if (impact > 25) {
      recommendation = 'MODERATE: Consider cash flow impact';
    } else {
      recommendation = 'LOW IMPACT: Payment is within normal range';
    }

    return {
      currentBalance,
      projectedBalance,
      impact,
      recommendation
    };
  }

  private generateRecommendations(riskScore: number, anomalies: string[]): string[] {
    const recommendations: string[] = [];

    if (riskScore > 70) {
      recommendations.push('REJECT: High risk detected - manual review required');
    } else if (riskScore > 40) {
      recommendations.push('REVIEW: Medium risk - additional verification recommended');
    } else if (riskScore > 20) {
      recommendations.push('CAUTION: Low-medium risk - proceed with standard checks');
    } else {
      recommendations.push('APPROVE: Low risk - safe to process');
    }

    if (anomalies.length > 0) {
      recommendations.push('Verify anomalies before processing');
    }

    return recommendations;
  }

  private generateExplanation(invoiceData: InvoiceData, riskScore: number, anomalies: string[]): string {
    let explanation = `Invoice Analysis for ${invoiceData.payee}:\n\n`;
    explanation += `Amount: $${invoiceData.amount.toLocaleString()}\n`;
    explanation += `Risk Score: ${riskScore}/100\n\n`;

    if (anomalies.length > 0) {
      explanation += `Detected Issues:\n`;
      anomalies.forEach(anomaly => {
        explanation += `• ${anomaly}\n`;
      });
    } else {
      explanation += `No significant anomalies detected.\n`;
    }

    explanation += `\nThis analysis is based on pattern recognition and should be reviewed by a human before final approval.`;

    return explanation;
  }
}

export const aiEngine = new AIEngine();