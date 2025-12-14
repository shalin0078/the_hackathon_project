# Invoice Data Requirements - Quick Guide

## What Data Does the System Need?

The AI-powered invoice system requires **4 simple fields**:

### 1. **Payee/Vendor Name**
- **What it is**: The person or company receiving the payment
- **Examples**: 
  - "Acme Corporation"
  - "John Doe Consulting"
  - "Tech Solutions Inc"
- **Format**: Any text
- **Required**: YES

### 2. **Amount**
- **What it is**: The payment amount in dollars
- **Examples**:
  - 500
  - 1250.50
  - 3500
- **Format**: Number (with or without decimals)
- **Required**: YES

### 3. **Description**
- **What it is**: What the invoice is for
- **Examples**:
  - "Web development services"
  - "Monthly consulting fee"
  - "Equipment purchase"
- **Format**: Any text
- **Required**: YES (for better AI analysis)

### 4. **Date**
- **What it is**: When the invoice was created
- **Examples**:
  - 2025-01-15
  - 01/15/2025
  - January 15, 2025
- **Format**: Any date format
- **Required**: YES

---

## How to Input Data

### Option 1: Manual Entry (Easiest)
Just type directly into the form:

```
Payee/Vendor: Tech Solutions Inc
Amount ($): 1250
Description: Website development services
Invoice Date: 2025-01-15
```

### Option 2: Text File Upload
Create a `.txt` file with this content:

```
Payee: Tech Solutions Inc
Amount: $1,250.00
Description: Website development services
Date: 01/15/2025
```

---

## What the AI Analyzes

### 1. Amount Risk
- **Low**: $0 - $1,000
- **Medium**: $1,001 - $5,000  
- **High**: Over $5,000

### 2. Payee Risk
- **Low**: Known/repeated vendor
- **Medium**: New vendor
- **High**: First-time/unknown vendor

### 3. Date Risk
- **Low**: Recent (last 30 days)
- **Medium**: 31-90 days old
- **High**: Over 90 days old

### 4. Description Risk
- **Low**: Detailed (10+ characters)
- **Medium**: Brief (5-10 characters)
- **High**: Missing/vague (<5 characters)

---

## AI Output You'll See

### Risk Score
```
Risk Score: 25/100
```
- 0-20: Low Risk → APPROVE
- 21-40: Medium Risk → REVIEW
- 41-100: High Risk → REJECT

### Anomalies Detected
```
• Amount is 150% higher than average
• New payee detected
• Invoice is 45 days old
```

### Recommendation
```
REVIEW: Medium risk - additional verification recommended
```

### Explanation
```
Invoice Analysis for Tech Solutions Inc:
Amount: $1,250
Risk Score: 25/100

Detected Issues:
• New payee detected

This analysis is based on pattern recognition and 
should be reviewed by a human before final approval.
```

### Cash Flow Impact
```
Current Balance: $10,000 MNEE
Projected Balance: $8,750 MNEE
Impact: 12.5%
Recommendation: LOW IMPACT - Payment is within normal range
```

---

## Quick Test Examples

### Example 1: Safe Invoice
```
Payee: Regular Vendor
Amount: 500
Description: Monthly subscription fee
Date: 2025-01-15

Expected: Low Risk (0-20), APPROVE
```

### Example 2: Medium Risk
```
Payee: New Company LLC
Amount: 2500
Description: Consulting services
Date: 2025-01-10

Expected: Medium Risk (21-40), REVIEW
```

### Example 3: High Risk
```
Payee: Unknown Supplier
Amount: 7500
Description: Equipment
Date: 2024-10-01

Expected: High Risk (41-100), REJECT
```

---

## That's It!

Just provide these 4 fields:
1. **Payee** (who gets paid)
2. **Amount** (how much)
3. **Description** (what for)
4. **Date** (when)

The AI does the rest automatically!