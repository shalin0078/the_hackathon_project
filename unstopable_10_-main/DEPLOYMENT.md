# Deployment Guide

## Quick Start Deployment

### Option 1: Local Development (Fastest)
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:3000
```
**Note**: AI works locally without blockchain deployment.

---

## Full Production Deployment

### Step 1: Deploy Smart Contract

#### A. Local Hardhat Network (Testing)
```bash
# Terminal 1 - Start local blockchain
npm run blockchain:node

# Terminal 2 - Deploy contract
npm run blockchain:deploy:local

# Copy contract address from output
```

#### B. Sepolia Testnet (Recommended)
```bash
# 1. Get Sepolia ETH from faucet
https://sepoliafaucet.com/

# 2. Create .env file in blockchain folder
cd blockchain
echo "PRIVATE_KEY=your_wallet_private_key" > .env
echo "SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY" >> .env

# 3. Deploy to Sepolia
npm run blockchain:deploy:sepolia

# 4. Copy contract address
```

#### C. Mainnet (Production)
```bash
# 1. Update hardhat.config.js with mainnet config
# 2. Get mainnet ETH
# 3. Deploy
cd blockchain
npx hardhat run scripts/deploy.js --network mainnet
```

### Step 2: Configure Frontend

```bash
# Update .env.local in root directory
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_YOUR_CONTRACT_ADDRESS
NEXT_PUBLIC_NETWORK_ID=11155111  # Sepolia
# NEXT_PUBLIC_NETWORK_ID=1  # Mainnet
```

### Step 3: Build Frontend

```bash
# Production build
npm run build

# Test production build locally
npm start
```

### Step 4: Deploy Frontend

#### Option A: Vercel (Recommended - Easiest)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK_ID=11155111
```

#### Option B: Netlify
```bash
# 1. Build static export
npm run export

# 2. Deploy 'out' folder to Netlify
# 3. Add environment variables in Netlify dashboard
```

#### Option C: IPFS (Fully Decentralized)
```bash
# 1. Build and export
npm run build
npm run export

# 2. Install IPFS CLI
npm install -g ipfs

# 3. Add to IPFS
ipfs add -r out/

# 4. Pin to Pinata/Fleek for persistence
```

#### Option D: AWS S3 + CloudFront
```bash
# 1. Build
npm run build
npm run export

# 2. Upload to S3
aws s3 sync out/ s3://your-bucket-name

# 3. Configure CloudFront distribution
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`npm run test:contract`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Wallet has sufficient funds for gas

### Smart Contract
- [ ] Contract compiled (`npm run blockchain:compile`)
- [ ] Contract deployed to target network
- [ ] Contract address saved
- [ ] Contract verified on Etherscan (optional)

### Frontend
- [ ] Environment variables set
- [ ] Production build tested
- [ ] Wallet connection working
- [ ] Contract interaction tested

### Post-Deployment
- [ ] Test invoice creation
- [ ] Test AI analysis
- [ ] Test blockchain submission
- [ ] Monitor gas usage
- [ ] Set up error tracking (Sentry)

---

## Network Configuration

### Sepolia Testnet
```javascript
Network Name: Sepolia
RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
Chain ID: 11155111
Currency: SepoliaETH
Block Explorer: https://sepolia.etherscan.io
```

### Ethereum Mainnet
```javascript
Network Name: Ethereum Mainnet
RPC URL: https://mainnet.infura.io/v3/YOUR_KEY
Chain ID: 1
Currency: ETH
Block Explorer: https://etherscan.io
```

---

## Cost Estimates

### Smart Contract Deployment
- **Sepolia (Testnet)**: Free (testnet ETH)
- **Mainnet**: ~$50-200 (varies with gas prices)

### Frontend Hosting
- **Vercel**: Free tier available
- **Netlify**: Free tier available
- **IPFS**: ~$5-20/month (pinning services)
- **AWS**: ~$10-50/month

### Transaction Costs
- **Submit Invoice**: ~$5-15 per transaction
- **Approve Invoice**: ~$3-8 per transaction
- **Process Payment**: ~$5-12 per transaction

---

## Troubleshooting

### Contract Deployment Fails
```bash
# Check balance
npx hardhat run scripts/check-balance.js --network sepolia

# Increase gas limit in hardhat.config.js
gas: 3000000
```

### Frontend Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Wallet Connection Issues
- Ensure MetaMask is installed
- Check network matches contract deployment
- Clear browser cache
- Try different wallet (OKX)

### Transaction Failures
- Check wallet has sufficient ETH
- Verify contract address is correct
- Ensure network ID matches
- Check gas price settings

---

## Monitoring & Maintenance

### Contract Monitoring
```bash
# View contract on Etherscan
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

# Monitor events
npx hardhat run scripts/monitor-events.js --network sepolia
```

### Frontend Monitoring
- Set up Vercel Analytics
- Configure error tracking (Sentry)
- Monitor API usage
- Track user metrics

### Updates
```bash
# Update contract (requires new deployment)
# Update frontend
git pull
npm install
npm run build
vercel --prod
```

---

## Security Best Practices

1. **Never commit private keys**
2. **Use environment variables**
3. **Test on testnet first**
4. **Audit smart contracts before mainnet**
5. **Set up rate limiting**
6. **Enable CORS properly**
7. **Use HTTPS only**
8. **Implement access controls**

---

## Support & Resources

- **Hardhat Docs**: https://hardhat.org/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Ethers.js Docs**: https://docs.ethers.org
- **Sepolia Faucet**: https://sepoliafaucet.com
- **Gas Tracker**: https://etherscan.io/gastracker
