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
  confidence: number;
  riskFactors: RiskFactor[];
}

export interface RiskFactor {
  category: string;
  score: number;
  weight: number;
  description: string;
}

export interface CashFlowSimulation {
  currentBalance: number;
  projectedBalance: number;
  impact: number;
  recommendation: string;
}

class AdvancedAIEngine {
  private invoiceHistory: InvoiceData[] = [];
  private payeeReputation: Map<string, number> = new Map();
  private fraudPatterns: string[] = ['urgent', 'immediate', 'wire', 'bitcoin', 'gift card'];

  async analyzeInvoiceRisk(invoiceData: InvoiceData, historicalData: InvoiceData[] = []): Promise<RiskAnalysis> {
    this.invoiceHistory = historicalData;
    
    const riskFactors: RiskFactor[] = [];
    let totalScore = 0;
    const anomalies: string[] = [];

    // 1. Amount Risk Analysis (Weight: 30%)
    const amountRisk = this.analyzeAmount(invoiceData, historicalData);
    riskFactors.push(amountRisk);
    totalScore += amountRisk.score * amountRisk.weight;
    if (amountRisk.score > 50) anomalies.push(amountRisk.description);

    // 2. Payee Risk Analysis (Weight: 25%)
    const payeeRisk = this.analyzePayee(invoiceData, historicalData);
    riskFactors.push(payeeRisk);
    totalScore += payeeRisk.score * payeeRisk.weight;
    if (payeeRisk.score > 50) anomalies.push(payeeRisk.description);

    // 3. Date Risk Analysis (Weight: 15%)
    const dateRisk = this.analyzeDate(invoiceData);
    riskFactors.push(dateRisk);
    totalScore += dateRisk.score * dateRisk.weight;
    if (dateRisk.score > 50) anomalies.push(dateRisk.description);

    // 4. Description Risk Analysis (Weight: 15%)
    const descRisk = this.analyzeDescription(invoiceData);
    riskFactors.push(descRisk);
    totalScore += descRisk.score * descRisk.weight;
    if (descRisk.score > 50) anomalies.push(descRisk.description);

    // 5. Pattern Matching (Weight: 15%)
    const patternRisk = this.analyzePatterns(invoiceData, historicalData);
    riskFactors.push(patternRisk);
    totalScore += patternRisk.score * patternRisk.weight;
    if (patternRisk.score > 50) anomalies.push(patternRisk.description);

    const finalScore = Math.min(Math.round(totalScore), 100);
    const confidence = this.calculateConfidence(historicalData.length, riskFactors);

    return {
      riskScore: finalScore,
      anomalies,
      recommendations: this.generateRecommendations(finalScore, anomalies, confidence),
      explanation: this.generateExplanation(invoiceData, finalScore, riskFactors, confidence),
      confidence,
      riskFactors
    };
  }

  private analyzeAmount(invoice: InvoiceData, history: InvoiceData[]): RiskFactor {
    let score = 0;
    let description = '';

    if (invoice.amount > 10000) {
      score = 80;
      description = `Very large amount: $${invoice.amount.toLocaleString()}`;
    } else if (invoice.amount > 5000) {
      score = 50;
      description = `Large amount: $${invoice.amount.toLocaleString()}`;
    }

    if (history.length > 0) {
      const amounts = history.map(h => h.amount);
      const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length);
      const zScore = Math.abs((invoice.amount - avg) / (stdDev || 1));

      if (zScore > 3) {
        score = Math.max(score, 90);
        description = `Amount ${(zScore * 100).toFixed(0)}% deviation from average`;
      } else if (zScore > 2) {
        score = Math.max(score, 60);
        description = `Amount significantly higher than average`;
      }
    }

    return {
      category: 'Amount Risk',
      score,
      weight: 0.30,
      description: description || 'Amount within normal range'
    };
  }

  private analyzePayee(invoice: InvoiceData, history: InvoiceData[]): RiskFactor {
    let score = 0;
    const payeeLower = invoice.payee.toLowerCase();
    
    const knownPayees = history.map(h => h.payee.toLowerCase());
    const payeeCount = knownPayees.filter(p => p === payeeLower).length;

    if (payeeCount === 0 && history.length > 0) {
      score = 60;
      return {
        category: 'Payee Risk',
        score,
        weight: 0.25,
        description: 'New payee - first transaction'
      };
    }

    const reputation = this.payeeReputation.get(payeeLower) || 50;
    if (reputation < 30) {
      score = 80;
      return {
        category: 'Payee Risk',
        score,
        weight: 0.25,
        description: 'Payee has poor reputation history'
      };
    }

    if (payeeCount > 5) {
      score = 10;
      return {
        category: 'Payee Risk',
        score,
        weight: 0.25,
        description: 'Trusted payee - multiple successful transactions'
      };
    }

    return {
      category: 'Payee Risk',
      score: 30,
      weight: 0.25,
      description: 'Known payee with limited history'
    };
  }

  private analyzeDate(invoice: InvoiceData): RiskFactor {
    const invoiceDate = new Date(invoice.date);
    const now = new Date();
    const daysDiff = (now.getTime() - invoiceDate.getTime()) / (1000 * 3600 * 24);

    if (daysDiff > 180) {
      return {
        category: 'Date Risk',
        score: 70,
        weight: 0.15,
        description: `Invoice is ${Math.round(daysDiff)} days old`
      };
    }

    if (daysDiff > 90) {
      return {
        category: 'Date Risk',
        score: 40,
        weight: 0.15,
        description: `Invoice is ${Math.round(daysDiff)} days old`
      };
    }

    if (daysDiff < 0) {
      return {
        category: 'Date Risk',
        score: 90,
        weight: 0.15,
        description: 'Future date detected - possible fraud'
      };
    }

    return {
      category: 'Date Risk',
      score: 10,
      weight: 0.15,
      description: 'Recent invoice date'
    };
  }

  private analyzeDescription(invoice: InvoiceData): RiskFactor {
    const desc = invoice.description.toLowerCase();
    let score = 0;

    if (desc.length < 5) {
      score = 70;
      return {
        category: 'Description Risk',
        score,
        weight: 0.15,
        description: 'Very vague description'
      };
    }

    if (desc.length < 10) {
      score = 40;
      return {
        category: 'Description Risk',
        score,
        weight: 0.15,
        description: 'Brief description'
      };
    }

    const suspiciousWords = this.fraudPatterns.filter(word => desc.includes(word));
    if (suspiciousWords.length > 0) {
      score = 85;
      return {
        category: 'Description Risk',
        score,
        weight: 0.15,
        description: `Suspicious keywords: ${suspiciousWords.join(', ')}`
      };
    }

    return {
      category: 'Description Risk',
      score: 10,
      weight: 0.15,
      description: 'Detailed description provided'
    };
  }

  private analyzePatterns(invoice: InvoiceData, history: InvoiceData[]): RiskFactor {
    if (history.length < 3) {
      return {
        category: 'Pattern Analysis',
        score: 20,
        weight: 0.15,
        description: 'Insufficient history for pattern analysis'
      };
    }

    const recentInvoices = history.slice(-10);
    const avgAmount = recentInvoices.reduce((sum, inv) => sum + inv.amount, 0) / recentInvoices.length;
    
    const similarAmounts = recentInvoices.filter(inv => 
      Math.abs(inv.amount - invoice.amount) / invoice.amount < 0.1
    ).length;

    if (similarAmounts > 3) {
      return {
        category: 'Pattern Analysis',
        score: 60,
        weight: 0.15,
        description: 'Repetitive amount pattern detected'
      };
    }

    const timeGaps = [];
    for (let i = 1; i < recentInvoices.length; i++) {
      const gap = new Date(recentInvoices[i].date).getTime() - new Date(recentInvoices[i-1].date).getTime();
      timeGaps.push(gap / (1000 * 3600 * 24));
    }
    const avgGap = timeGaps.reduce((a, b) => a + b, 0) / timeGaps.length;

    if (avgGap < 1) {
      return {
        category: 'Pattern Analysis',
        score: 50,
        weight: 0.15,
        description: 'Unusually frequent invoices'
      };
    }

    return {
      category: 'Pattern Analysis',
      score: 15,
      weight: 0.15,
      description: 'Normal transaction patterns'
    };
  }

  private calculateConfidence(historySize: number, factors: RiskFactor[]): number {
    let confidence = 50;

    if (historySize > 20) confidence += 30;
    else if (historySize > 10) confidence += 20;
    else if (historySize > 5) confidence += 10;

    const avgFactorScore = factors.reduce((sum, f) => sum + f.score, 0) / factors.length;
    if (avgFactorScore > 70 || avgFactorScore < 30) confidence += 10;

    return Math.min(confidence, 95);
  }

  private generateRecommendations(score: number, anomalies: string[], confidence: number): string[] {
    const recs: string[] = [];

    if (score > 80) {
      recs.push('🚫 REJECT: Critical risk - Do not process');
      recs.push('Requires senior management approval');
      recs.push('Verify payee identity through multiple channels');
    } else if (score > 60) {
      recs.push('⚠️ HIGH RISK: Extensive verification required');
      recs.push('Contact payee directly to confirm');
      recs.push('Request additional documentation');
    } else if (score > 40) {
      recs.push('⚡ MEDIUM RISK: Additional checks recommended');
      recs.push('Verify invoice details');
      recs.push('Review payment history');
    } else if (score > 20) {
      recs.push('✓ LOW-MEDIUM RISK: Standard verification');
      recs.push('Proceed with normal approval process');
    } else {
      recs.push('✅ LOW RISK: Safe to process');
      recs.push('Standard approval sufficient');
    }

    if (confidence < 60) {
      recs.push(`⚠️ Confidence: ${confidence}% - Limited historical data`);
    }

    return recs;
  }

  private generateExplanation(invoice: InvoiceData, score: number, factors: RiskFactor[], confidence: number): string {
    let exp = `Advanced AI Risk Analysis for ${invoice.payee}\n\n`;
    exp += `Amount: $${invoice.amount.toLocaleString()}\n`;
    exp += `Overall Risk Score: ${score}/100\n`;
    exp += `Analysis Confidence: ${confidence}%\n\n`;

    exp += `Risk Factor Breakdown:\n`;
    factors.forEach(factor => {
      const impact = (factor.score * factor.weight).toFixed(1);
      exp += `• ${factor.category}: ${factor.score}/100 (Impact: ${impact})\n`;
      exp += `  ${factor.description}\n`;
    });

    exp += `\n⚠️ This AI analysis is advisory only. Human review required for final approval.`;

    return exp;
  }

  simulateCashFlow(invoiceAmount: number, currentBalance: number): CashFlowSimulation {
    const projectedBalance = currentBalance - invoiceAmount;
    const impact = (invoiceAmount / currentBalance) * 100;

    let recommendation = '';
    if (projectedBalance < 0) {
      recommendation = '🚫 CRITICAL: Payment will result in negative balance';
    } else if (projectedBalance < currentBalance * 0.1) {
      recommendation = '⚠️ WARNING: Less than 10% balance remaining';
    } else if (impact > 50) {
      recommendation = '⚡ CAUTION: Payment represents >50% of balance';
    } else if (impact > 25) {
      recommendation = '✓ MODERATE: Consider cash flow impact';
    } else {
      recommendation = '✅ LOW IMPACT: Payment within safe range';
    }

    return {
      currentBalance,
      projectedBalance,
      impact,
      recommendation
    };
  }

  updatePayeeReputation(payee: string, successful: boolean) {
    const current = this.payeeReputation.get(payee.toLowerCase()) || 50;
    const newRep = successful ? Math.min(current + 10, 100) : Math.max(current - 20, 0);
    this.payeeReputation.set(payee.toLowerCase(), newRep);
  }
}

export const advancedAIEngine = new AdvancedAIEngine();