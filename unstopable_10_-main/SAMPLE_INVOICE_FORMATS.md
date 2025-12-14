# Sample Invoice Formats for Testing

## Text File Format (.txt)

Create a `.txt` file with the following format:

### Example 1: Simple Invoice
```
Invoice #: INV-2025-001
Date: 01/15/2025
Payee: Acme Corporation
Amount: $1,250.00
Description: Web development services for Q1 2025
```

### Example 2: Detailed Invoice
```
INVOICE

Invoice Number: INV-2025-002
Invoice Date: 01/20/2025
Due Date: 02/20/2025

Bill To: Tech Solutions Inc.
Vendor: John Doe Consulting

Item Description: Software development and consulting services
Amount: $3,500.00
Tax: $350.00
Total: $3,850.00

Payment Terms: Net 30 days
```

### Example 3: Service Invoice
```
SERVICE INVOICE

Date: 01/25/2025
Payee: Digital Marketing Agency
Supplier: Creative Services LLC

Description: Monthly marketing campaign management
Service Period: January 2025
Amount: $2,750.50

Payment Method: Bank Transfer
Reference: PROJ-2025-Q1
```

---

## Manual Entry Format

When entering invoice data manually in the application:

### Required Fields:
- **Payee/Vendor**: Name of the person/company receiving payment
- **Amount**: Numeric value (e.g., 1000, 2500.50)
- **Description**: Brief description of the invoice
- **Date**: Invoice date (YYYY-MM-DD format)

### Example Entries:

#### Low Risk Invoice
```
Payee: ABC Services Ltd
Amount: 500
Description: Monthly subscription fee
Date: 2025-01-15
```

#### Medium Risk Invoice
```
Payee: New Vendor Inc
Amount: 2500
Description: Equipment purchase
Date: 2025-01-10
```

#### High Risk Invoice
```
Payee: Unknown Supplier
Amount: 8500
Description: Large payment
Date: 2024-10-15
```

---

## Sample Text Files to Create

### sample-invoice-1.txt
```
Invoice: INV-001
Date: 01/15/2025
Payee: Tech Solutions Inc
Amount: $1,200.00
Description: Website maintenance and hosting services
```

### sample-invoice-2.txt
```
INVOICE DETAILS

Invoice Number: INV-002
Date: 01/18/2025
Vendor: Marketing Agency Pro
Amount: $4,500.00
Service: Social media marketing campaign
Payment Terms: Net 30
```

### sample-invoice-3.txt
```
Invoice #: INV-003
Date: 01/20/2025
Bill To: John Smith
From: Consulting Services LLC
Amount: $750.50
Description: Business consulting - 5 hours @ $150/hr
```

---

## AI Analysis Triggers

The AI engine will analyze these patterns:

### Amount Analysis
- **Low Risk**: $0 - $1,000
- **Medium Risk**: $1,001 - $5,000
- **High Risk**: $5,001+

### Date Analysis
- **Low Risk**: Within last 30 days
- **Medium Risk**: 31-90 days old
- **High Risk**: Over 90 days old

### Payee Analysis
- **Low Risk**: Known/repeated payee
- **Medium Risk**: New payee
- **High Risk**: Unknown/suspicious payee

### Description Analysis
- **Low Risk**: Detailed description (>10 characters)
- **Medium Risk**: Brief description (5-10 characters)
- **High Risk**: Missing/vague description (<5 characters)

---

## Test Scenarios

### Scenario 1: Normal Invoice (Low Risk)
```
Payee: Regular Vendor Inc
Amount: 850
Description: Monthly service fee for January 2025
Date: 2025-01-15

Expected Risk Score: 0-20
Expected Recommendation: APPROVE
```

### Scenario 2: New Vendor (Medium Risk)
```
Payee: New Tech Solutions
Amount: 2500
Description: Software license
Date: 2025-01-10

Expected Risk Score: 21-40
Expected Recommendation: REVIEW
```

### Scenario 3: Large Payment (High Risk)
```
Payee: Unknown Supplier
Amount: 7500
Description: Equipment
Date: 2024-11-01

Expected Risk Score: 41-100
Expected Recommendation: REJECT
```

---

## Quick Copy-Paste Templates

### Template 1: Standard Invoice
```
Invoice: INV-2025-001
Date: 01/15/2025
Payee: Your Company Name
Amount: $1,000.00
Description: Professional services rendered
```

### Template 2: Consulting Invoice
```
Invoice Number: CONS-2025-001
Date: 01/20/2025
Vendor: Consulting Firm LLC
Amount: $2,500.00
Description: Business strategy consulting - 10 hours
```

### Template 3: Product Invoice
```
Invoice: PROD-2025-001
Date: 01/25/2025
Supplier: Tech Equipment Co
Amount: $3,750.00
Description: Computer hardware and accessories
```

---

## How to Use

### Method 1: Upload Text File
1. Create a `.txt` file with any format above
2. Click "Create Invoice" in the app
3. Click "Upload Invoice (PDF/Text)"
4. Select your `.txt` file
5. AI will automatically extract data

### Method 2: Manual Entry
1. Click "Create Invoice"
2. Fill in the form fields:
   - Payee/Vendor
   - Amount ($)
   - Description
   - Invoice Date
3. Click "Analyze with AI"
4. Review risk analysis
5. Submit to blockchain

---

## Expected AI Output

For any invoice, you'll see:

### Risk Analysis Display
```
Risk Score: 25/100
Status: Medium Risk

Detected Issues:
• New payee detected
• Amount is 150% higher than average

Recommendation: REVIEW - Medium risk - additional verification recommended

AI Explanation:
Invoice Analysis for [Payee Name]:
Amount: $X,XXX
Risk Score: XX/100

Detected Issues:
• [List of anomalies]

This analysis is based on pattern recognition and should be reviewed 
by a human before final approval.
```

### Cash Flow Simulation
```
Current Balance: $10,000 MNEE
Projected Balance: $8,500 MNEE
Impact: 15%
Recommendation: MODERATE - Consider cash flow impact
```

---

## Tips for Testing

1. **Start Simple**: Use Template 1 with low amounts
2. **Test Risk Levels**: Try different amounts to see risk scoring
3. **Test Dates**: Use old dates to trigger date warnings
4. **Test Descriptions**: Try empty/short descriptions
5. **Test New Payees**: Use different payee names each time

---

**Ready to test!** Create any of these sample files or use manual entry to test the AI-powered invoice analysis.