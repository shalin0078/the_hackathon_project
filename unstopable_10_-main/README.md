# AI-Powered Invoice Automation Platform

[![Unstoppable Hackathon](https://img.shields.io/badge/Hackathon-Unstoppable-blue)](https://docs.stability.nexus/about-us/unstoppable-hackathon)
[![Open Source](https://img.shields.io/badge/Track-Open%20Source-green)](https://github.com/shalin0078/unstopable_10)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Project Description

A decentralized invoice automation platform that combines AI analysis with blockchain transparency. The system addresses 9 key problems in invoice processing:

1. **Manual Invoice Processing** - Automated PDF parsing and data extraction
2. **Fraud Detection** - AI-powered anomaly detection and risk scoring
3. **Cash Flow Management** - Predictive cash flow simulation
4. **Transparency Issues** - Blockchain-based audit trail
5. **Payment Delays** - Automated approval workflows
6. **Human Error** - AI validation with human oversight
7. **Compliance Tracking** - Immutable record keeping
8. **Cost Inefficiency** - Reduced processing overhead
9. **Lack of Insights** - Plain-language AI explanations

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   AI Engine     │    │   Blockchain    │
│   (Next.js)     │◄──►│  (Client-side)   │◄──►│   (Ethereum)    │
│                 │    │                 │    │                 │
│ • PDF Upload    │    │ • Risk Analysis │    │ • Smart Contract│
│ • Wallet Connect│    │ • Anomaly Det.  │    │ • MNEE Token    │
│ • Dashboard     │    │ • Cash Flow Sim │    │ • Audit Trail   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MetaMask or compatible Web3 wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd invoice-automation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional required packages**
   ```bash
   npm install pdf.js-dist @xenova/transformers @web3-react/core
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Alchemy/Infura API key
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Deploy smart contracts (optional)**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### Smart Contract Deployment

1. Install Hardhat:
   ```bash
   npm install --save-dev hardhat
   ```

2. Configure `hardhat.config.js` with Sepolia testnet
3. Deploy to testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## Features

### Core Functionality
- **PDF Invoice Parsing** - Extract data from uploaded invoices
- **AI Risk Analysis** - Detect anomalies and assess payment risks
- **Cash Flow Simulation** - Predict financial impact of payments
- **Blockchain Integration** - Store invoice metadata on-chain
- **Wallet Integration** - Connect with MetaMask and other Web3 wallets
- **Human-in-the-Loop** - AI suggestions require manual approval

### AI Capabilities (Client-Side)
- Anomaly detection using lightweight ML models
- Risk scoring based on historical patterns
- Plain-language explanations of findings
- Cash flow impact predictions
- Fraud detection alerts

### Blockchain Features
- Invoice metadata storage on Ethereum
- MNEE token integration for payments
- Immutable audit trail
- Smart contract automation

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Blockchain**: Ethereum, Ethers.js, Hardhat
- **AI**: Transformers.js (client-side)
- **File Processing**: PDF.js
- **Deployment**: Vercel, IPFS

## Project Maturity

**Status: Hackathon Prototype**

This is a proof-of-concept developed for hackathon demonstration. The project includes:

✅ **Completed Features:**
- Basic UI components and dashboard
- Wallet connection infrastructure
- Invoice upload interface
- Smart contract foundation

🚧 **In Development:**
- AI model integration
- PDF parsing implementation
- Blockchain deployment
- End-to-end testing

📋 **Planned Features:**
- Production-ready smart contracts
- Advanced AI models
- Multi-chain support
- Enterprise integrations

## Demo

[Demo Video Link] - Coming Soon

## Contributing

This project is open source under GPL v3. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

GNU General Public License v3.0 - see [LICENSE.md](LICENSE.md)

## Copyright

© 2025 Invoice Automation Team - see [COPYRIGHT.md](COPYRIGHT.md)
