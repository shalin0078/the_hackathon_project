import { InvoiceData } from './ai-engine';

export class PDFParser {
  async parseInvoice(file: File): Promise<InvoiceData> {
    if (typeof window === 'undefined') {
      throw new Error('PDF parsing only available in browser');
    }
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + ' ';
      }

      return this.extractInvoiceData(fullText);
    } catch (error) {
      console.error('PDF parsing failed:', error);
      throw new Error('Failed to parse PDF. Please try uploading a text file or enter data manually.');
    }
  }

  private extractInvoiceData(text: string): InvoiceData {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    // Extract amount (looking for currency symbols and numbers)
    const amountRegex = /(?:\$|USD|€|EUR|£|GBP)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    const amountMatches = [...cleanText.matchAll(amountRegex)];
    const amounts = amountMatches.map(match => parseFloat(match[1].replace(/,/g, '')));
    const amount = amounts.length > 0 ? Math.max(...amounts) : 0;

    // Extract payee (looking for common patterns)
    const payeePatterns = [
      /(?:pay\s+to|payee|vendor|supplier):\s*([^\n\r,]+)/i,
      /(?:bill\s+to|invoice\s+to):\s*([^\n\r,]+)/i,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Inc|LLC|Corp|Ltd)\.?)?)$/m
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
      /(?:date|invoice\s+date|due\s+date):\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
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

    // Extract description (first meaningful line or invoice number)
    const descriptionPatterns = [
      /(?:description|item|service):\s*([^\n\r]+)/i,
      /(?:invoice\s+#|inv\s+#|reference):\s*([^\n\r\s]+)/i
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

  // Fallback method for manual text input
  parseTextInput(text: string): InvoiceData {
    return this.extractInvoiceData(text);
  }
}