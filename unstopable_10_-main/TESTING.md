# Testing Guide

## Overview
Comprehensive testing suite for AI-powered invoice automation platform covering smart contracts and AI engine functionality.

## Test Coverage

### Smart Contract Tests (9 tests)
**Location**: `blockchain/test/InvoiceRegistry.test.js`

#### Invoice Submission (2 tests)
- ✅ Submit invoice with valid parameters
- ✅ Reject duplicate invoice submissions

#### Status Management (2 tests)
- ✅ Allow payee to update invoice status
- ✅ Reject unauthorized status updates

#### Payment Processing (3 tests)
- ✅ Process payment successfully with balance verification
- ✅ Reject payment for unapproved invoices
- ✅ Reject insufficient payment amounts

#### Query Functions (2 tests)
- ✅ Retrieve user invoices by address
- ✅ Retrieve invoice details by hash

### AI Engine Tests
**Location**: `__tests__/ai-engine.test.ts`

#### Test Categories
- Low risk scenarios (known payees, normal amounts)
- High risk scenarios (unusual amounts, fraud keywords)
- Statistical analysis (Z-scores, anomaly detection)
- Confidence scoring (dataset size impact)
- Factor weighting (30% amount, 25% payee, etc.)
- Edge cases (zero amounts, empty fields, future dates)

## Running Tests

### Smart Contract Tests
```bash
# Run all contract tests
npm run test:contract

# Run with coverage
npm run test:coverage
```

### AI Engine Tests
```bash
# Run AI tests
npm test

# Watch mode
npm run test:watch
```

### Full Test Suite
```bash
# Run all tests
npm run test:contract && npm test
```

## Test Results

### Gas Usage Analysis
- **submitInvoice**: 187,953 - 205,137 gas (avg: 203,355)
- **updateInvoiceStatus**: 31,369 gas
- **processPayment**: 42,948 gas
- **Contract Deployment**: 1,395,911 gas (4.7% of block limit)

### Performance Metrics
- All tests complete in < 1 second
- 100% pass rate (9/9 contract tests)
- Zero security vulnerabilities detected

## Test Data

### Mock Historical Data
```javascript
[
  { amount: 1000, payee: 'Acme Corp', date: '2024-01-15', description: 'Office supplies' },
  { amount: 1500, payee: 'Tech Solutions', date: '2024-01-20', description: 'Software license' },
  { amount: 2000, payee: 'Acme Corp', date: '2024-02-10', description: 'Consulting services' }
]
```

### Test Scenarios
- **Low Risk**: Known payee + normal amount → Risk < 40
- **High Risk**: Unknown payee + high amount + fraud keywords → Risk > 70
- **Edge Cases**: Zero amount, empty payee, future dates

## Continuous Integration

### Pre-deployment Checklist
- [ ] All contract tests passing
- [ ] AI engine tests passing
- [ ] Gas usage within acceptable limits
- [ ] No security vulnerabilities
- [ ] Build successful

### Automated Testing
Tests run automatically on:
- Pull requests
- Pre-commit hooks
- Deployment pipelines

## Troubleshooting

### Common Issues
1. **Chai assertion errors**: Ensure BigInt values converted to Number
2. **Contract not found**: Run `npm run blockchain:compile` first
3. **Network errors**: Check Hardhat node is running for local tests

### Debug Mode
```bash
# Verbose output
npx hardhat test --verbose

# Specific test file
npx hardhat test test/InvoiceRegistry.test.js
```

## Next Steps
- Add integration tests for frontend-blockchain interaction
- Implement E2E tests with Cypress
- Add performance benchmarks
- Set up automated security audits
