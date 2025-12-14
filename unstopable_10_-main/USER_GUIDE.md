# User Guide - AI Invoice Automation

## Understanding the Error Message

### "User Rejected Action" - This is NORMAL! ✅

When you see this error:
```
user rejected action (action="sendTransaction", reason="rejected")
```

**This means**: You clicked "Reject" or "Cancel" in your MetaMask wallet popup.

**This is expected behavior** - it's part of the human-in-the-loop safety feature!

---

## How to Use the System

### Step 1: Connect Wallet
1. Click "Connect Wallet"
2. MetaMask popup appears
3. Click "Connect" (not reject!)
4. Accept the KYA modal

### Step 2: Create Invoice
1. Click "Create Invoice"
2. Fill in the form:
   - **Payee**: Who gets paid (e.g., "Tech Solutions Inc")
   - **Amount**: How much (e.g., 1000)
   - **Description**: What for (e.g., "Web services")
   - **Date**: Invoice date

### Step 3: AI Analysis
1. Click "Analyze with AI"
2. Wait 1-2 seconds
3. Review the results:
   - Risk Score (0-100)
   - Detected Issues
   - Recommendation
   - AI Explanation

### Step 4: Submit to Blockchain
1. Click "Submit to Blockchain"
2. **MetaMask popup appears** 👈 IMPORTANT!
3. Review the transaction details
4. Click "Confirm" (NOT "Reject")

### Step 5: Success!
- Transaction processes
- Invoice appears in dashboard
- You'll see transaction hash

---

## MetaMask Popup Guide

### What You'll See:
```
MetaMask Notification
─────────────────────
Contract Interaction
To: 0x5FbDB...180aa3
Amount: 0 ETH
Gas Fee: ~$0.50

[Reject]  [Confirm]
```

### What to Do:
- ✅ Click **"Confirm"** to submit invoice
- ❌ Click **"Reject"** to cancel (you'll see the error)

### Why It Asks:
This is the **human-in-the-loop safety feature**:
- AI analyzes the invoice
- AI provides recommendations
- **YOU make the final decision**
- No autonomous actions possible

---

## Common Scenarios

### Scenario 1: You Want to Submit
1. Review AI analysis
2. Click "Submit to Blockchain"
3. MetaMask pops up
4. Click **"Confirm"**
5. ✅ Success!

### Scenario 2: You Change Your Mind
1. Review AI analysis
2. Click "Submit to Blockchain"
3. MetaMask pops up
4. Click **"Reject"**
5. ❌ Error appears (this is normal!)
6. You can edit the invoice or close the dialog

### Scenario 3: High Risk Invoice
1. AI shows: "Risk Score: 85/100"
2. Recommendation: "REJECT"
3. You can still submit if you want
4. MetaMask asks for confirmation
5. **You decide**: Confirm or Reject

---

## Error Messages Explained

### "Transaction cancelled - You rejected the wallet signature"
- **Meaning**: You clicked "Reject" in MetaMask
- **Action**: This is normal! Try again if you want to submit

### "Blockchain submission failed"
- **Meaning**: Network or contract error
- **Action**: Check your network connection, try again

### "Wallet not connected"
- **Meaning**: MetaMask not connected
- **Action**: Click "Connect Wallet" first

### "Please fill in payee and amount fields"
- **Meaning**: Required fields missing
- **Action**: Fill in all required fields

---

## Tips for Success

### ✅ DO:
- Review AI analysis carefully
- Read the risk score and recommendations
- Confirm transactions you want to submit
- Reject transactions you don't want

### ❌ DON'T:
- Blindly confirm without reading
- Ignore high-risk warnings
- Submit without AI analysis
- Panic when you see "rejected" error (it's normal!)

---

## Understanding AI Recommendations

### APPROVE (Low Risk: 0-20)
```
✅ Safe to process
✅ Normal amount
✅ Known payee
✅ Recent date
```
**Action**: Safe to confirm in MetaMask

### REVIEW (Medium Risk: 21-40)
```
⚠️ Additional verification recommended
⚠️ New payee or higher amount
⚠️ Some anomalies detected
```
**Action**: Double-check details before confirming

### REJECT (High Risk: 41-100)
```
❌ High risk detected
❌ Large amount or unknown payee
❌ Multiple anomalies
```
**Action**: Investigate thoroughly before confirming

---

## The Human-in-the-Loop Process

```
1. You enter invoice data
   ↓
2. AI analyzes risk
   ↓
3. AI shows recommendations
   ↓
4. YOU review the analysis
   ↓
5. YOU click "Submit to Blockchain"
   ↓
6. MetaMask asks for confirmation
   ↓
7. YOU make final decision (Confirm/Reject)
   ↓
8. Transaction executes (if confirmed)
```

**At NO point does AI act autonomously!**

---

## FAQ

### Q: Why does MetaMask keep popping up?
**A**: This is the safety feature - every blockchain action requires your approval.

### Q: Can I skip the MetaMask confirmation?
**A**: No - this is required for security. The AI cannot submit transactions without your signature.

### Q: What if I accidentally reject?
**A**: No problem! Just click "Submit to Blockchain" again and confirm this time.

### Q: Does rejecting cost gas fees?
**A**: No - rejecting is free. You only pay gas when you confirm.

### Q: Can the AI submit invoices automatically?
**A**: No - the AI only analyzes. YOU must approve every transaction.

### Q: What if AI says "REJECT" but I want to submit?
**A**: You can still submit! AI provides recommendations, but YOU make the final decision.

---

## Quick Reference

| Action | Result |
|--------|--------|
| Click "Analyze with AI" | AI analyzes invoice (no blockchain) |
| Click "Submit to Blockchain" | MetaMask popup appears |
| Click "Confirm" in MetaMask | Transaction submits ✅ |
| Click "Reject" in MetaMask | Transaction cancelled ❌ |
| See "rejected" error | Normal - you cancelled it |

---

**Remember**: The "rejected" error is not a bug - it's proof that the human-in-the-loop safety feature is working correctly! 🎉