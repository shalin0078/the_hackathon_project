import { analyzeInvoice } from '@/lib/ai-engine-advanced';

describe('Advanced AI Engine', () => {
  const mockHistoricalData = [
    { amount: 1000, payee: 'Acme Corp', date: new Date('2024-01-15'), description: 'Office supplies' },
    { amount: 1500, payee: 'Tech Solutions', date: new Date('2024-01-20'), description: 'Software license' },
    { amount: 2000, payee: 'Acme Corp', date: new Date('2024-02-10'), description: 'Consulting services' },
  ];

  describe('Low Risk Scenarios', () => {
    it('Should score low risk for known payee with normal amount', () => {
      const result = analyzeInvoice(
        1200,
        'Acme Corp',
        new Date('2024-03-15'),
        'Office supplies',
        mockHistoricalData
      );

      expect(result.riskScore).toBeLessThan(40);
      expect(result.riskLevel).toBe('low');
      expect(result.confidence).toBeGreaterThan(70);
    });

    it('Should handle first-time payee with reasonable amount', () => {
      const result = analyzeInvoice(
        800,
        'New Vendor LLC',
        new Date('2024-03-15'),
        'Cleaning services',
        mockHistoricalData
      );

      expect(result.riskScore).toBeLessThan(60);
      expect(result.payeeReputation).toBe('new');
    });
  });

  describe('High Risk Scenarios', () => {
    it('Should flag unusually high amount', () => {
      const result = analyzeInvoice(
        50000,
        'Unknown Company',
        new Date('2024-03-15'),
        'Urgent payment required',
        mockHistoricalData
      );

      expect(result.riskScore).toBeGreaterThan(70);
      expect(result.riskLevel).toBe('high');
      expect(result.factors.amount.score).toBeGreaterThan(80);
    });

    it('Should detect fraud keywords', () => {
      const result = analyzeInvoice(
        5000,
        'Offshore Holdings',
        new Date('2024-03-15'),
        'URGENT wire transfer needed immediately',
        mockHistoricalData
      );

      expect(result.riskScore).toBeGreaterThan(60);
      expect(result.factors.description.details).toContain('fraud');
    });

    it('Should flag weekend/holiday dates', () => {
      const result = analyzeInvoice(
        3000,
        'Test Vendor',
        new Date('2024-03-17'), // Sunday
        'Emergency repair',
        mockHistoricalData
      );

      expect(result.factors.date.score).toBeGreaterThan(50);
    });
  });

  describe('Statistical Analysis', () => {
    it('Should calculate Z-score for amount anomalies', () => {
      const result = analyzeInvoice(
        10000, // 5x average
        'Regular Vendor',
        new Date('2024-03-15'),
        'Standard service',
        mockHistoricalData
      );

      expect(result.factors.amount.details).toContain('standard deviations');
      expect(result.factors.amount.score).toBeGreaterThan(70);
    });

    it('Should track payee reputation', () => {
      const result = analyzeInvoice(
        1800,
        'Acme Corp', // Appears twice in history
        new Date('2024-03-15'),
        'Regular service',
        mockHistoricalData
      );

      expect(result.payeeReputation).toBe('trusted');
      expect(result.factors.payee.score).toBeLessThan(30);
    });
  });

  describe('Confidence Scoring', () => {
    it('Should have high confidence with large dataset', () => {
      const largeDataset = Array(100).fill(null).map((_, i) => ({
        amount: 1000 + i * 10,
        payee: `Vendor ${i % 10}`,
        date: new Date(2024, 0, i + 1),
        description: 'Service'
      }));

      const result = analyzeInvoice(
        1500,
        'Vendor 5',
        new Date('2024-03-15'),
        'Service',
        largeDataset
      );

      expect(result.confidence).toBeGreaterThan(90);
    });

    it('Should have lower confidence with small dataset', () => {
      const result = analyzeInvoice(
        1000,
        'Test Vendor',
        new Date('2024-03-15'),
        'Service',
        []
      );

      expect(result.confidence).toBeLessThan(70);
    });
  });

  describe('Factor Weighting', () => {
    it('Should apply correct weights to risk factors', () => {
      const result = analyzeInvoice(
        2000,
        'Test Vendor',
        new Date('2024-03-15'),
        'Service',
        mockHistoricalData
      );

      const totalWeight = 
        result.factors.amount.weight +
        result.factors.payee.weight +
        result.factors.date.weight +
        result.factors.description.weight +
        result.factors.pattern.weight;

      expect(totalWeight).toBe(100);
      expect(result.factors.amount.weight).toBe(30);
      expect(result.factors.payee.weight).toBe(25);
    });

    it('Should calculate weighted impact correctly', () => {
      const result = analyzeInvoice(
        1000,
        'Known Vendor',
        new Date('2024-03-15'),
        'Service',
        mockHistoricalData
      );

      Object.values(result.factors).forEach(factor => {
        const expectedImpact = (factor.score * factor.weight) / 100;
        expect(Math.abs(factor.impact - expectedImpact)).toBeLessThan(0.1);
      });
    });
  });

  describe('Edge Cases', () => {
    it('Should handle zero amount', () => {
      const result = analyzeInvoice(
        0,
        'Test Vendor',
        new Date('2024-03-15'),
        'Service',
        mockHistoricalData
      );

      expect(result.riskScore).toBeGreaterThan(80);
      expect(result.riskLevel).toBe('critical');
    });

    it('Should handle empty payee name', () => {
      const result = analyzeInvoice(
        1000,
        '',
        new Date('2024-03-15'),
        'Service',
        mockHistoricalData
      );

      expect(result.factors.payee.score).toBeGreaterThan(70);
    });

    it('Should handle future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const result = analyzeInvoice(
        1000,
        'Test Vendor',
        futureDate,
        'Service',
        mockHistoricalData
      );

      expect(result.factors.date.score).toBeGreaterThan(60);
    });
  });
});
