# AI-Powered Invoice Automation - Complete Setup Guide

This guide will walk you through setting up the complete invoice automation platform step by step.

## Prerequisites

- Node.js 18+ installed
- Git installed
- MetaMask browser extension
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-invoice-automation

# Install frontend dependencies
npm install
```

### 2. Blockchain Setup

```bash
# Navigate to blockchain directory
cd blockchain

# Install blockchain dependencies (already done if you followed step 1)
npm install

# Compile smart contracts
npm run compile
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration:
# - Add Alchemy/Infura API key
# - Add private key for deployment (testnet only!)
# - Update contract addresses after deployment
```

### 4. Smart Contract Deployment

#### Local Development
```bash
# Start local Hardhat node (in blockchain directory)
npm run node

# In another terminal, deploy to local network
npm run deploy:local
```

#### Sepolia Testnet
```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Note the deployed contract address for frontend configuration
```

### 5. Frontend Configuration

Update the contract address in your environment file:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed contract address
```

### 6. Run the Application

```bash
# Start the development server (from root directory)
npm run dev

# Open http://localhost:3000 in your browser
```

## Testing the Complete Flow

### 1. Connect Wallet
- Open the application
- Click "Connect Wallet" 
- Accept the KYA (Know Your Agent) modal
- Connect your MetaMask wallet

### 2. Create Invoice
- Click "Create Invoice"
- Upload a PDF invoice OR enter details manually
- Click "Analyze with AI" to get risk assessment
- Review AI analysis results
- Click "Submit to Blockchain" to store on-chain

### 3. View Dashboard
- Check the dashboard for invoice status
- View transaction history
- Monitor risk scores and recommendations

## Key Features Demonstrated

### AI Analysis
- PDF parsing and data extraction
- Risk scoring (0-100 scale)
- Anomaly detection
- Plain-language explanations
- Cash flow simulation

### Blockchain Integration
- Smart contract interaction
- Invoice metadata storage
- Transaction transparency
- Wallet integration

### Human-in-the-Loop Safety
- All actions require user approval
- No autonomous transactions
- Clear AI limitations explained
- Manual confirmation required

## Architecture Overview

```
Frontend (Next.js) ←→ AI Engine (Client-side) ←→ Blockchain (Ethereum)
     ↓                      ↓                         ↓
• PDF Upload          • Risk Analysis           • Smart Contract
• Wallet Connect      • Anomaly Detection       • MNEE Token
• Dashboard           • Cash Flow Sim           • Audit Trail
```

## Troubleshooting

### Common Issues

1. **Contract compilation fails**
   ```bash
   cd blockchain
   npm install --save-dev hardhat@^2.19.0
   npm run compile
   ```

2. **MetaMask connection issues**
   - Ensure you're on the correct network (Sepolia for testnet)
   - Check that the contract address is correct
   - Verify you have test ETH for gas fees

3. **PDF parsing fails**
   - Try with a text file instead
   - Enter data manually as fallback
   - Check browser console for errors

4. **AI analysis not working**
   - Models download on first use (may take time)
   - Check browser console for loading errors
   - Ensure sufficient browser memory

## Development Scripts

```bash
# Frontend development
npm run dev              # Start development server
npm run build           # Build for production
npm run lint            # Run linting

# Blockchain development
npm run blockchain:compile      # Compile contracts
npm run blockchain:deploy:local # Deploy to local network
npm run blockchain:deploy:sepolia # Deploy to Sepolia
npm run blockchain:test        # Run contract tests
npm run blockchain:node        # Start local blockchain
```

## Security Notes

- Never commit private keys to version control
- Use testnet for development and testing
- The AI provides recommendations only - human approval required
- All transactions require wallet signature
- Smart contracts are for demonstration purposes

## Next Steps for Production

1. **Security Audit**: Have smart contracts professionally audited
2. **Advanced AI**: Implement more sophisticated ML models
3. **Multi-chain**: Add support for other blockchains
4. **Enterprise Features**: Add user management, permissions, etc.
5. **Performance**: Optimize for large-scale usage

## Support

For issues and questions:
1. Check this setup guide
2. Review the main README.md
3. Check GitHub issues
4. Contact the development team

---

**Project Status**: Hackathon Prototype
**License**: GPL v3.0
**Last Updated**: December 2025