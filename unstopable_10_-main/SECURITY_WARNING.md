# 🚨 CRITICAL SECURITY WARNINGS

## ⚠️ NEVER DO THESE THINGS:

### 1. **NEVER Use Mainnet for Testing**
```
❌ WRONG: https://eth-mainnet.g.alchemy.com/v2/...
✅ CORRECT: https://eth-sepolia.g.alchemy.com/v2/...
```

**Why?**
- Mainnet = Real ETH = Real money
- Sepolia = Test ETH = Free
- Mistakes on mainnet cost real money!

---

### 2. **NEVER Share API Keys Publicly**
```
❌ WRONG: Posting API keys in chat/forums/GitHub
✅ CORRECT: Keep in .env files (gitignored)
```

**If you accidentally shared:**
1. Go to https://dashboard.alchemy.com/
2. Delete or regenerate the key immediately
3. Check for unauthorized usage

---

### 3. **NEVER Commit Private Keys**
```
❌ WRONG: Committing .env with PRIVATE_KEY
✅ CORRECT: .env in .gitignore, use .env.example template
```

**If you committed a private key:**
1. Transfer all funds to new wallet immediately
2. Never use that wallet again
3. Revoke all permissions

---

### 4. **NEVER Use Production Wallets for Testing**
```
❌ WRONG: Using wallet with real ETH for testing
✅ CORRECT: Create separate testnet-only wallet
```

---

## ✅ SAFE TESTING CHECKLIST:

- [ ] Using Sepolia testnet (Chain ID: 11155111)
- [ ] Using test wallet (no real funds)
- [ ] API keys in .env.local (gitignored)
- [ ] Private keys never committed
- [ ] Testing with free Sepolia ETH from faucet

---

## 🔐 CORRECT CONFIGURATION:

### For Testing (Sepolia):
```bash
ALCHEMY_API_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia
```

### For Production (Mainnet):
```bash
# Only after thorough testing on Sepolia!
# Only with audited contracts!
# Only with proper security measures!
ALCHEMY_API_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_NETWORK_NAME=mainnet
```

---

## 💰 COST COMPARISON:

| Action | Sepolia | Mainnet |
|--------|---------|---------|
| Get ETH | FREE (faucet) | $2,000+ per ETH |
| Deploy Contract | FREE | $50-200 |
| Transaction | FREE | $5-50 |
| Mistake | FREE | EXPENSIVE! |

---

## 🎯 RECOMMENDED WORKFLOW:

1. **Development**: Local Hardhat network
2. **Testing**: Sepolia testnet
3. **Staging**: Sepolia testnet (final tests)
4. **Production**: Mainnet (after audit)

---

## 📞 IF YOU MADE A MISTAKE:

### Shared API Key:
1. Revoke immediately at https://dashboard.alchemy.com/
2. Create new key
3. Update .env.local
4. Never share again

### Committed Private Key:
1. Transfer all funds to new wallet NOW
2. Abandon compromised wallet
3. Check transaction history
4. Report if funds stolen

### Used Mainnet by Accident:
1. Stop all transactions immediately
2. Check wallet balance
3. Switch to Sepolia
4. Review transaction costs

---

## 🛡️ SECURITY BEST PRACTICES:

1. **Always use testnet first**
2. **Keep private keys offline**
3. **Use hardware wallets for mainnet**
4. **Audit contracts before mainnet**
5. **Test with small amounts first**
6. **Monitor all transactions**
7. **Use multi-sig for production**
8. **Keep backups secure**

---

**Remember: Blockchain transactions are IRREVERSIBLE. Test thoroughly on Sepolia before using mainnet!**
