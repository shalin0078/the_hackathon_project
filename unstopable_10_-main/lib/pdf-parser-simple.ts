import { InvoiceData } from './ai-engine-simple';

export class SimplePDFParser {
  async parseInvoice(file: File): Promise<InvoiceData> {
    try {
      const text = await file.text();
      return this.extractInvoiceData(text);
    } catch (error) {
      console.error('PDF parsing failed:', error);
      throw new Error('Failed to parse file. Please enter data manually.');
    }
  }

  private extractInvoiceData(text: string): InvoiceData {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    // Extract amount
    const amountRegex = /(?:\$|USD|€|EUR|£|GBP)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    const amountMatches = [...cleanText.matchAll(amountRegex)];
    const amounts = amountMatches.map(match => parseFloat(match[1].replace(/,/g, '')));
    const amount = amounts.length > 0 ? Math.max(...amounts) : 0;

    // Extract payee
    const payeePatterns = [
      /(?:pay\s+to|payee|vendor|supplier):\s*([^\n\r,]+)/i,
      /(?:bill\s+to|invoice\s+to):\s*([^\n\r,]+)/i,
    ];
    
    let payee = 'Unknown Payee';
    for (const pattern of payeePatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        payee = match[1].trim();
        break;
      }
    }

    // Extract date
    const datePatterns = [
      /(?:date|invoice\s+date):\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g
    ];
    
    let date = new Date().toISOString().split('T')[0];
    for (const pattern of datePatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        const parsedDate = new Date(match[1]);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate.toISOString().split('T')[0];
          break;
        }
      }
    }

    // Extract description
    const descriptionPatterns = [
      /(?:description|item|service):\s*([^\n\r]+)/i,
      /(?:invoice\s+#|inv\s+#):\s*([^\n\r\s]+)/i
    ];
    
    let description = 'Invoice Payment';
    for (const pattern of descriptionPatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        description = match[1].trim();
        break;
      }
    }

    return {
      amount,
      payee,
      date,
      description
    };
  }

  parseTextInput(text: string): InvoiceData {
    return this.extractInvoiceData(text);
  }
}