# 🚀 Blockchain Deployment - Complete Guide

## ✅ Prerequisites Completed
- ✅ Smart contract compiled
- ✅ Deployment script ready
- ✅ Tests passing (9/9)
- ✅ Frontend deployed

---

## 📋 What You Need (3 Things)

### 1. **Sepolia ETH** (Free)
Get from: https://sepoliafaucet.com/
- Connect MetaMask
- Request test ETH
- Wait 1-2 minutes

### 2. **MetaMask Private Key**
⚠️ Use testnet wallet only!
- Open MetaMask
- Click ⋮ → Account Details
- Show Private Key
- Copy it

### 3. **Sepolia API Key**
Get from: https://dashboard.alchemy.com/
- Create App
- Network: Sepolia
- Copy HTTPS URL

---

## 🎯 Deployment Steps

### **Step 1: Configure Environment**

```bash
cd blockchain
```

Create `.env` file with:
```bash
PRIVATE_KEY=your_private_key_here
ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/your_key_here
```

### **Step 2: Deploy Contract**

```bash
npm run deploy:sepolia
```

**Expected Output:**
```
Deploying InvoiceRegistry contract...
InvoiceRegistry deployed to: 0x1234567890abcdef...
Deployment completed successfully!
```

**Copy the contract address!**

### **Step 3: Update Frontend**

```bash
cd ..
```

Update `.env.local`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_CHAIN_ID=11155111
```

### **Step 4: Redeploy Frontend**

```bash
vercel --prod --yes
```

---

## 🎉 Done!

Your blockchain features are now live:
- ✅ Submit invoices to blockchain
- ✅ Process payments
- ✅ Track transactions
- ✅ View on Etherscan

---

## 🔍 Verify Deployment

1. **Check Etherscan:**
   ```
   https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
   ```

2. **Test on Your App:**
   - Connect MetaMask (Sepolia network)
   - Create invoice
   - Submit to blockchain
   - Confirm transaction

---

## 💰 Costs

- Deployment: FREE (Sepolia testnet)
- Transactions: FREE (test ETH)
- Testing: FREE
- Total: $0

---

## ⚠️ Troubleshooting

### "Insufficient funds"
- Get more Sepolia ETH from faucet
- Check wallet balance

### "Invalid private key"
- Ensure no spaces
- Include 0x prefix if needed
- Use testnet wallet only

### "Network error"
- Check Alchemy API URL
- Verify Sepolia network selected
- Try again in 1 minute

---

## 📞 Need Help?

Run this command for automated setup:
```bash
npm run blockchain:setup
```

Or follow manual steps above.

---

**Time Required:** 5 minutes  
**Cost:** FREE  
**Difficulty:** Easy
