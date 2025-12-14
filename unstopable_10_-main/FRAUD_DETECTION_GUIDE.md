# AI Fraud Detection & Wallet Protection

## How AI Detects False/Fraudulent Data

### What the AI Checks:

1. **Amount Validation**
   - Unusually high amounts (>$5,000)
   - Amounts significantly different from historical average
   - Suspicious round numbers

2. **Payee Verification**
   - Unknown or new payees
   - Suspicious payee names
   - First-time vendors

3. **Date Analysis**
   - Very old invoices (>90 days)
   - Future dates
   - Inconsistent dates

4. **Description Quality**
   - Missing descriptions
   - Vague or generic descriptions
   - Suspicious keywords

---

## Risk Score Levels

### Low Risk (0-20) ✅
```
✅ Normal amount
✅ Known payee
✅ Recent date
✅ Good description
```
**Wallet Behavior**: Will likely approve

### Medium Risk (21-40) ⚠️
```
⚠️ Slightly high amount
⚠️ New payee
⚠️ Some anomalies
```
**Wallet Behavior**: May show warnings

### High Risk (41-100) ❌
```
❌ Very high amount
❌ Unknown payee
❌ Multiple red flags
❌ POTENTIAL FRAUD
```
**Wallet Behavior**: May reject for your protection

---

## Why OKX Wallet Rejects Transactions

### Reason 1: High Risk Score
When AI detects risk score >70:
- OKX Wallet sees suspicious transaction
- Protects you from potential fraud
- Shows error: "Transaction rejected"

### Reason 2: False Data Detected
AI flags indicate:
- Fraudulent invoice data
- Suspicious amounts
- Unknown recipients
- OKX blocks for safety

### Reason 3: Smart Contract Validation
The smart contract checks:
- Risk score must be ≤100
- Amount must be >0
- Due date must be future
- If validation fails, wallet rejects

---

## Example: Fraudulent Invoice Detection

### Input (False Data):
```
Payee: Unknown Scammer
Amount: 15000
Description: Pay now
Date: 2024-01-01
```

### AI Analysis:
```
Risk Score: 95/100 ❌

Detected Issues:
• Amount $15,000 is 500% higher than average
• New payee detected
• Invoice is 347 days old
• Insufficient invoice description

Recommendation: REJECT - High risk detected - manual review required

⚠️ FRAUD WARNING: This invoice may contain false or fraudulent data!
```

### Wallet Response (OKX/MetaMask):
```
❌ Transaction Rejected
Reason: High risk transaction detected
Action: Wallet blocked for your protection
```

---

## What Happens When You Submit Fraudulent Data

### Step 1: You Enter False Data
```
Payee: Fake Company
Amount: 99999
Description: urgent
Date: 2020-01-01
```

### Step 2: AI Analyzes
```
⚠️ AI detects multiple red flags
⚠️ Risk Score: 100/100
⚠️ Recommendation: REJECT
```

### Step 3: You Try to Submit
```
Click "Submit to Blockchain"
↓
Wallet popup appears
↓
Wallet sees high-risk transaction
↓
Wallet REJECTS automatically
```

### Step 4: Error Message
```
❌ Transaction rejected by wallet
❌ Reason: Fraudulent data detected
❌ Your funds are protected
```

---

## How to Fix Rejected Transactions

### If Legitimate Invoice:

1. **Review AI Warnings**
   - Check what triggered high risk
   - Verify all data is correct

2. **Provide More Details**
   - Add detailed description
   - Use recent date
   - Verify payee name

3. **Lower Amount (if possible)**
   - Split large invoices
   - Process in smaller batches

4. **Try Again**
   - Re-analyze with AI
   - Check new risk score
   - Submit if score improves

### If Actually Fraudulent:

1. **Don't Submit**
   - AI is protecting you
   - Wallet rejection is correct
   - Investigate the invoice

2. **Verify Source**
   - Contact payee directly
   - Confirm invoice legitimacy
   - Check for scam indicators

3. **Report if Scam**
   - Document the attempt
   - Report to authorities
   - Thank the AI for catching it!

---

## Wallet Compatibility

### Supported Wallets:
- ✅ MetaMask
- ✅ OKX Wallet
- ✅ Any Web3-compatible wallet

### How Wallets Protect You:

**MetaMask:**
- Shows transaction details
- Warns about high-risk contracts
- Allows you to reject

**OKX Wallet:**
- Advanced fraud detection
- Automatic risk assessment
- May auto-reject suspicious transactions

**Both:**
- Require your signature
- Show gas fees
- Display contract interaction details

---

## Testing Fraud Detection

### Test 1: Normal Invoice (Should Pass)
```
Payee: Regular Vendor Inc
Amount: 500
Description: Monthly service fee for January 2025
Date: 2025-01-15

Expected: Risk 0-20, Wallet approves ✅
```

### Test 2: Suspicious Invoice (Should Warn)
```
Payee: New Unknown Company
Amount: 8500
Description: Payment
Date: 2024-06-01

Expected: Risk 60-80, Wallet warns ⚠️
```

### Test 3: Fraudulent Invoice (Should Reject)
```
Payee: Scammer123
Amount: 99999
Description: urgent pay now!!!
Date: 2020-01-01

Expected: Risk 90-100, Wallet rejects ❌
```

---

## Understanding Error Messages

### "Transaction rejected by wallet"
- **Meaning**: Wallet detected fraud
- **Cause**: High AI risk score
- **Action**: Review invoice data

### "User denied request signature"
- **Meaning**: You clicked reject
- **Cause**: Manual rejection
- **Action**: Normal behavior

### "Invalid risk score"
- **Meaning**: Risk score >100
- **Cause**: System error
- **Action**: Contact support

### "Insufficient payment"
- **Meaning**: Not enough funds
- **Cause**: Low wallet balance
- **Action**: Add funds

---

## Best Practices

### ✅ DO:
- Provide accurate invoice data
- Use detailed descriptions
- Verify payee information
- Check AI risk score before submitting
- Review wallet warnings

### ❌ DON'T:
- Submit fake/test data to production
- Ignore high-risk warnings
- Force through rejected transactions
- Use suspicious payee names
- Enter unrealistic amounts

---

## AI Protection Features

### 1. Pre-Submission Analysis
- Analyzes before blockchain
- Catches fraud early
- Saves gas fees

### 2. Risk Scoring
- 0-100 scale
- Multiple factors
- Clear recommendations

### 3. Anomaly Detection
- Pattern recognition
- Historical comparison
- Suspicious behavior flagging

### 4. Plain-Language Warnings
- Clear explanations
- Specific issues listed
- Actionable recommendations

### 5. Wallet Integration
- Communicates risk to wallet
- Enables wallet-level protection
- Double-layer security

---

## Summary

**The AI fraud detection is working correctly when:**
- ✅ It flags suspicious invoices
- ✅ It shows high risk scores
- ✅ Your wallet rejects fraudulent data
- ✅ You're protected from scams

**This is a FEATURE, not a bug!**

The system is designed to:
1. Detect false/fraudulent data
2. Warn you about risks
3. Let your wallet protect you
4. Prevent financial loss

**If your wallet rejects a transaction with high AI risk score, it's protecting you!** 🛡️