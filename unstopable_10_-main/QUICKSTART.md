# Quick Start Guide

## ✅ Setup Complete!

Your AI-powered invoice automation platform is ready to run.

## Start the Application

```bash
npm run dev
```

Then open: **http://localhost:3000**

## What Works Now

### ✅ Frontend
- Invoice dashboard with UI components
- Wallet connection interface
- Invoice creation dialog
- AI analysis display
- KYA (Know Your Agent) modal

### ✅ Smart Contracts
- InvoiceRegistry.sol compiled successfully
- Ready for deployment to testnet
- Located in `/blockchain` directory

### ✅ AI Features (Client-Side)
- PDF parsing (lazy-loaded)
- Risk analysis engine
- Anomaly detection
- Cash flow simulation

### ✅ Blockchain Integration
- Ethers.js configured
- Wallet connection ready
- Smart contract interaction setup

## Test the Features

1. **View Dashboard**: Open http://localhost:3000
2. **Connect Wallet**: Click "Connect Wallet" (requires MetaMask)
3. **Accept KYA**: Review AI limitations and accept
4. **Create Invoice**: 
   - Click "Create Invoice"
   - Upload PDF or enter manually
   - Click "Analyze with AI"
   - Review risk analysis
   - Submit to blockchain (requires wallet signature)

## Deploy Smart Contracts (Optional)

### Local Network
```bash
# Terminal 1: Start local blockchain
cd blockchain
npm run node

# Terminal 2: Deploy contracts
npm run deploy:local
```

### Sepolia Testnet
```bash
# 1. Get Sepolia ETH from faucet
# 2. Add your private key to blockchain/.env
# 3. Deploy
cd blockchain
npm run deploy:sepolia
```

## Project Structure

```
├── app/                    # Next.js pages
├── components/             # React components
│   ├── create-invoice-dialog.tsx  # AI-powered invoice creation
│   ├── kya-modal.tsx             # Know Your Agent modal
│   └── ...
├── lib/                    # Core libraries
│   ├── ai-engine.ts       # AI risk analysis
│   ├── pdf-parser.ts      # PDF processing
│   └── blockchain.ts      # Smart contract interaction
├── blockchain/            # Smart contracts
│   ├── contracts/         # Solidity files
│   └── scripts/          # Deployment scripts
└── public/               # Static assets
```

## Key Features Demonstrated

1. **Manual Processing → Automation**: PDF parsing extracts data automatically
2. **Fraud Detection**: AI risk scoring (0-100 scale)
3. **Cash Flow Management**: Predictive balance simulation
4. **Transparency**: Blockchain audit trail
5. **Payment Delays**: Automated approval workflows
6. **Human Error Reduction**: AI validation with human oversight
7. **Compliance**: Immutable record keeping
8. **Cost Efficiency**: Reduced processing overhead
9. **Insights**: Plain-language AI explanations

## Human-in-the-Loop Safety

- ✅ All AI analysis is advisory only
- ✅ No autonomous actions possible
- ✅ Every transaction requires wallet signature
- ✅ Clear limitations explained in KYA modal
- ✅ User maintains full control

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### MetaMask Not Detected
- Install MetaMask browser extension
- Refresh the page
- Click "Connect Wallet"

### AI Models Loading Slowly
- Models download on first use (~50MB)
- Subsequent loads are cached
- Check browser console for progress

## Next Steps

1. ✅ Application is running
2. Test all features locally
3. Deploy contracts to testnet
4. Record demo video
5. Submit to hackathon

## Support

- Check SETUP.md for detailed instructions
- Review README.md for architecture
- Check browser console for errors

---

**Status**: ✅ Ready for Demo
**Build**: ✅ Successful
**License**: GPL v3.0