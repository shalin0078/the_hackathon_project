# 🔗 Blockchain Setup Guide

## Current Status

✅ **Frontend:** Deployed on Vercel  
⚠️ **Blockchain:** Not deployed yet  
📝 **Network:** Configured for Sepolia Testnet  

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Get Sepolia API Key

1. **Go to Alchemy Dashboard:**
   ```
   https://dashboard.alchemy.com/
   ```

2. **Create New App:**
   - Click "Create App"
   - Name: `Invoice Automation Sepolia`
   - Chain: `Ethereum`
   - Network: `Sepolia` (NOT Mainnet!)
   - Click "Create App"

3. **Copy API URL:**
   - Click on your app
   - Click "API Key"
   - Copy the HTTPS URL (looks like: `https://eth-sepolia.g.alchemy.com/v2/...`)

### Step 2: Get Sepolia ETH (Free)

1. **Visit Faucet:**
   ```
   https://sepoliafaucet.com/
   ```

2. **Get Test ETH:**
   - Connect your MetaMask wallet
   - Request Sepolia ETH
   - Wait 1-2 minutes

### Step 3: Configure Deployment

1. **Create blockchain/.env file:**
   ```bash
   cd blockchain
   echo PRIVATE_KEY=your_metamask_private_key > .env
   echo ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY >> .env
   ```

   **Get Private Key from MetaMask:**
   - Open MetaMask
   - Click 3 dots → Account Details
   - Show Private Key
   - Copy it

   ⚠️ **SECURITY:** Use a testnet-only wallet!

### Step 4: Deploy Smart Contract

```bash
# Make sure you're in blockchain directory
cd blockchain

# Deploy to Sepolia
npm run deploy:sepolia
```

**Expected Output:**
```
Deploying InvoiceRegistry...
Contract deployed to: 0x1234567890abcdef...
```

**Copy the contract address!**

### Step 5: Update Frontend

1. **Update .env.local in root directory:**
   ```bash
   cd ..
   echo NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress > .env.local
   echo NEXT_PUBLIC_CHAIN_ID=11155111 >> .env.local
   ```

2. **Redeploy to Vercel:**
   ```bash
   vercel --prod --yes
   ```

---

## 🌐 Network Information

### Sepolia Testnet (For Testing)
```
Network Name: Sepolia
RPC URL: https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
Chain ID: 11155111
Currency: SepoliaETH (Free)
Block Explorer: https://sepolia.etherscan.io
Faucet: https://sepoliafaucet.com
```

### Ethereum Mainnet (For Production)
```
Network Name: Ethereum Mainnet
RPC URL: https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
Chain ID: 1
Currency: ETH (Real Money!)
Block Explorer: https://etherscan.io
Cost: $50-200 to deploy contract
```

---

## 📋 Deployment Checklist

- [ ] Created Sepolia app in Alchemy
- [ ] Got Sepolia ETH from faucet
- [ ] Created blockchain/.env with private key
- [ ] Deployed contract to Sepolia
- [ ] Copied contract address
- [ ] Updated .env.local with contract address
- [ ] Redeployed frontend to Vercel
- [ ] Tested wallet connection
- [ ] Tested invoice submission

---

## 🔧 Troubleshooting

### "Insufficient funds"
- Get more Sepolia ETH from faucet
- Check wallet balance in MetaMask

### "Invalid API key"
- Verify you copied the full URL
- Make sure it's Sepolia, not Mainnet
- Check for extra spaces

### "Contract deployment failed"
- Ensure you have Sepolia ETH
- Check private key is correct
- Try increasing gas limit

### "Wrong network"
- Switch MetaMask to Sepolia network
- Add Sepolia network if not present:
  - Network Name: Sepolia
  - RPC URL: https://sepolia.infura.io/v3/
  - Chain ID: 11155111
  - Currency: SepoliaETH

---

## 💰 Cost Breakdown

### Sepolia Testnet (FREE)
- Get ETH: FREE (faucet)
- Deploy Contract: FREE
- Transactions: FREE
- Testing: FREE

### Ethereum Mainnet (EXPENSIVE)
- Get ETH: $2,000+ per ETH
- Deploy Contract: $50-200
- Each Transaction: $5-50
- Mistakes: COSTLY!

---

## 🎯 What Works Without Blockchain

Your app already works without deploying the contract:
- ✅ AI invoice analysis
- ✅ Risk scoring
- ✅ Dashboard UI
- ✅ PDF parsing
- ❌ Blockchain submission (needs contract)

---

## 📞 Need Help?

1. Check this guide
2. Review SECURITY_WARNING.md
3. See DEPLOYMENT.md
4. Check console for errors

---

**Remember: Always test on Sepolia before using Mainnet!**
