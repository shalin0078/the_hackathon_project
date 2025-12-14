# Complete Decentralization Deployment Guide

## Current Status
- ✅ Smart contracts ready
- ✅ Frontend built
- ✅ AI engine client-side
- 🔲 Deploy to blockchain
- 🔲 Deploy to IPFS/decentralized hosting

---

## Step 1: Deploy Smart Contracts to Blockchain

### Option A: Sepolia Testnet (Recommended for Testing)

1. **Get Sepolia ETH**
   ```
   Visit: https://sepoliafaucet.com/
   Enter your wallet address
   Receive test ETH
   ```

2. **Configure Environment**
   ```bash
   cd blockchain
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_key
   ```

3. **Deploy Contract**
   ```bash
   npm run deploy:sepolia
   ```

4. **Save Contract Address**
   ```
   Copy the deployed address from terminal
   Example: 0x1234567890abcdef1234567890abcdef12345678
   ```

5. **Update Frontend**
   Edit `/.env.local`:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
   NEXT_PUBLIC_NETWORK_NAME=sepolia
   NEXT_PUBLIC_CHAIN_ID=11155111
   ```

### Option B: Ethereum Mainnet (Production)

1. **Get Real ETH** (~0.1 ETH for deployment)

2. **Configure for Mainnet**
   ```
   ALCHEMY_API_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
   PRIVATE_KEY=your_mainnet_private_key
   ```

3. **Deploy**
   ```bash
   npm run deploy:mainnet
   ```

---

## Step 2: Deploy Frontend to IPFS

### Option A: Using Fleek (Easiest)

1. **Build for Production**
   ```bash
   npm run build
   npm run export
   ```

2. **Sign up at Fleek**
   ```
   Visit: https://fleek.co
   Connect GitHub
   ```

3. **Deploy**
   ```
   - Select repository
   - Build command: npm run build
   - Publish directory: out
   - Deploy
   ```

4. **Get IPFS Hash**
   ```
   Example: QmXxxx...
   Access: https://ipfs.io/ipfs/QmXxxx...
   ```

### Option B: Using IPFS Desktop

1. **Install IPFS Desktop**
   ```
   Download: https://docs.ipfs.tech/install/ipfs-desktop/
   ```

2. **Build Static Site**
   ```bash
   npm run build
   npm run export
   ```

3. **Add to IPFS**
   ```
   - Open IPFS Desktop
   - Add folder: /out
   - Copy CID
   ```

4. **Access**
   ```
   https://ipfs.io/ipfs/YOUR_CID
   ```

### Option C: Using Pinata

1. **Sign up at Pinata**
   ```
   Visit: https://pinata.cloud
   ```

2. **Upload Build**
   ```bash
   npm run build
   # Upload /out folder to Pinata
   ```

3. **Get Gateway URL**
   ```
   https://gateway.pinata.cloud/ipfs/YOUR_CID
   ```

---

## Step 3: Configure Decentralized Storage

### Store Invoice Data on IPFS

Update `lib/blockchain.ts`:

```typescript
// Add IPFS upload function
async uploadToIPFS(data: any): Promise<string> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result.IpfsHash;
}

// Update submitInvoice to use IPFS
async submitInvoice(invoiceData: InvoiceData, riskScore: number): Promise<string> {
  // Upload metadata to IPFS
  const ipfsHash = await this.uploadToIPFS({
    description: invoiceData.description,
    originalAmount: invoiceData.amount,
    currency: 'USD',
    date: invoiceData.date
  });
  
  // Submit to blockchain with IPFS hash
  const metadata = `ipfs://${ipfsHash}`;
  // ... rest of code
}
```

---

## Step 4: Use Decentralized Domain (ENS)

### Register ENS Domain

1. **Visit ENS**
   ```
   https://app.ens.domains
   ```

2. **Register Domain**
   ```
   Example: invoice-automation.eth
   Cost: ~$5/year + gas
   ```

3. **Point to IPFS**
   ```
   - Set Content Hash to your IPFS CID
   - Users access: invoice-automation.eth
   ```

---

## Step 5: Remove Centralized Dependencies

### Current Centralized Parts:
- ❌ Vercel hosting
- ❌ Alchemy RPC (centralized)
- ❌ Environment variables

### Make Fully Decentralized:

1. **Use Decentralized RPC**
   ```typescript
   // Use multiple RPC providers
   const providers = [
     'https://eth-sepolia.g.alchemy.com/v2/demo',
     'https://sepolia.infura.io/v3/demo',
     'https://rpc.sepolia.org'
   ];
   ```

2. **Store Config On-Chain**
   ```solidity
   // Add to smart contract
   string public ipfsGateway = "https://ipfs.io/ipfs/";
   string public frontendCID;
   
   function updateFrontendCID(string memory _cid) external onlyOwner {
     frontendCID = _cid;
   }
   ```

3. **Remove API Keys**
   ```
   - Use public RPC endpoints
   - Use IPFS public gateways
   - No server-side code
   ```

---

## Step 6: Verify Full Decentralization

### Checklist:

- ✅ Smart contract on blockchain (immutable)
- ✅ Frontend on IPFS (distributed)
- ✅ AI runs client-side (no servers)
- ✅ Data stored on IPFS (distributed)
- ✅ ENS domain (decentralized DNS)
- ✅ No centralized APIs
- ✅ No server dependencies

### Test Decentralization:

1. **Turn off your computer**
   - Site still accessible via IPFS
   - Smart contract still works
   - Other nodes serve content

2. **Access from anywhere**
   ```
   https://ipfs.io/ipfs/YOUR_CID
   https://gateway.pinata.cloud/ipfs/YOUR_CID
   https://cloudflare-ipfs.com/ipfs/YOUR_CID
   ```

3. **Verify on blockchain**
   ```
   https://sepolia.etherscan.io/address/YOUR_CONTRACT
   ```

---

## Complete Deployment Commands

```bash
# 1. Deploy Smart Contract
cd blockchain
npm run compile
npm run deploy:sepolia

# 2. Update Frontend Config
# Edit .env.local with contract address

# 3. Build Frontend
cd ..
npm run build

# 4. Deploy to IPFS (using Fleek)
# Connect GitHub and deploy

# 5. Register ENS (optional)
# Visit app.ens.domains

# 6. Test
# Access via IPFS gateway
```

---

## Decentralization Architecture

```
┌─────────────────────────────────────────┐
│         User's Browser                  │
│  ┌──────────────────────────────────┐  │
│  │  Frontend (from IPFS)            │  │
│  │  - React App                     │  │
│  │  - AI Engine (client-side)       │  │
│  │  - No servers needed             │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
           ↓                    ↓
    ┌──────────┐         ┌──────────┐
    │   IPFS   │         │Blockchain│
    │ Network  │         │ (Ethereum)│
    │          │         │          │
    │ Stores:  │         │ Stores:  │
    │ Frontend │         │ Contract │
    │ Metadata │         │ Invoices │
    └──────────┘         └──────────┘
         ↓                     ↓
    Distributed           Immutable
    Globally              Permanent
```

---

## Cost Breakdown

### One-Time Costs:
- Smart Contract Deployment: ~$50-100 (gas fees)
- ENS Domain Registration: ~$5/year

### Ongoing Costs:
- IPFS Pinning: $0-20/month (Pinata/Fleek)
- Transaction Gas: ~$1-5 per invoice submission
- ENS Renewal: ~$5/year

### Free Options:
- Public IPFS gateways: Free
- Sepolia testnet: Free (test ETH)
- IPFS Desktop: Free (self-host)

---

## Maintenance

### Update Frontend:
```bash
# 1. Make changes
# 2. Build new version
npm run build

# 3. Upload to IPFS
# Get new CID

# 4. Update ENS
# Point to new CID

# Old version still accessible
# Users gradually migrate
```

### Update Smart Contract:
```
⚠️ Smart contracts are immutable!
- Deploy new version
- Migrate data if needed
- Update frontend to use new address
```

---

## Security Considerations

### Decentralized = More Secure:
- ✅ No single point of failure
- ✅ Censorship resistant
- ✅ Always available
- ✅ Transparent and auditable

### But Still Need:
- ✅ Secure private keys
- ✅ Audit smart contracts
- ✅ Test thoroughly
- ✅ Monitor for issues

---

## Access Your Decentralized App

After deployment:

```
Via IPFS:
https://ipfs.io/ipfs/YOUR_CID

Via ENS:
https://YOUR_DOMAIN.eth.limo

Via Pinata:
https://gateway.pinata.cloud/ipfs/YOUR_CID

Via Cloudflare:
https://cloudflare-ipfs.com/ipfs/YOUR_CID
```

**Your app is now fully decentralized!** 🎉

No servers, no downtime, no censorship, accessible forever!