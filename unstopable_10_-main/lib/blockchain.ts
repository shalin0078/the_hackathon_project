import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}
import { InvoiceData } from './ai-engine';

const INVOICE_REGISTRY_ABI = [
  "function submitInvoice(bytes32 _invoiceHash, address _payee, uint256 _amount, uint8 _riskScore, string memory _metadata) external",
  "function updateInvoiceStatus(bytes32 _invoiceHash, uint8 _status) external",
  "function processPayment(bytes32 _invoiceHash) external payable",
  "function getInvoice(bytes32 _invoiceHash) external view returns (tuple(bytes32 invoiceHash, address payee, uint256 amount, uint256 timestamp, uint8 status, uint8 riskScore, string metadata))",
  "function getUserInvoices(address _user) external view returns (bytes32[] memory)",
  "event InvoiceSubmitted(bytes32 indexed invoiceHash, address indexed payee, uint256 amount)",
  "event InvoiceStatusUpdated(bytes32 indexed invoiceHash, uint8 status)",
  "event PaymentProcessed(bytes32 indexed invoiceHash, uint256 amount)"
];

// Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

export enum InvoiceStatus {
  Submitted = 0,
  Approved = 1,
  Paid = 2,
  Rejected = 3
}

export interface BlockchainInvoice {
  invoiceHash: string;
  payee: string;
  amount: string;
  timestamp: string;
  status: InvoiceStatus;
  riskScore: number;
  metadata: string;
}

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async connect(): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Web3 wallet not found. Please install MetaMask or OKX Wallet.');
    }

    try {
      // Support both MetaMask and OKX Wallet
      const provider = window.ethereum;
      this.provider = new ethers.BrowserProvider(provider);
      await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();
      
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, INVOICE_REGISTRY_ABI, this.signer);
      
      const address = await this.signer.getAddress();
      console.log('Connected to wallet:', address);
      return address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async submitInvoice(invoiceData: InvoiceData, riskScore: number): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      // Create invoice hash
      const invoiceString = JSON.stringify(invoiceData);
      const invoiceHash = ethers.keccak256(ethers.toUtf8Bytes(invoiceString));
      
      // Convert amount to wei - fix decimal precision
      const conversionRate = 0.0003;
      const ethAmount = invoiceData.amount * conversionRate;
      // Round to 18 decimals max to avoid precision errors
      const roundedAmount = Math.floor(ethAmount * 1e18) / 1e18;
      const amountInWei = ethers.parseEther(roundedAmount.toFixed(18));
      
      const metadata = JSON.stringify({
        description: invoiceData.description,
        originalAmount: invoiceData.amount,
        currency: 'USD',
        date: invoiceData.date
      });

      const tx = await this.contract.submitInvoice(
        invoiceHash,
        await this.signer.getAddress(), // For demo, payee is the connected wallet
        amountInWei,
        Math.min(riskScore, 255),
        metadata
      );

      console.log('Transaction submitted:', tx.hash);
      await tx.wait();
      console.log('Invoice submitted to blockchain:', invoiceHash);
      
      return invoiceHash;
    } catch (error) {
      console.error('Failed to submit invoice:', error);
      throw error;
    }
  }

  async updateInvoiceStatus(invoiceHash: string, status: InvoiceStatus): Promise<void> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.contract.updateInvoiceStatus(invoiceHash, status);
      await tx.wait();
      console.log('Invoice status updated:', invoiceHash, status);
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      throw error;
    }
  }

  async processPayment(invoiceHash: string, amount: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.contract.processPayment(invoiceHash, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      console.log('Payment processed:', invoiceHash);
    } catch (error) {
      console.error('Failed to process payment:', error);
      throw error;
    }
  }

  async getInvoice(invoiceHash: string): Promise<BlockchainInvoice> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const invoice = await this.contract.getInvoice(invoiceHash);
      return {
        invoiceHash: invoice.invoiceHash,
        payee: invoice.payee,
        amount: ethers.formatEther(invoice.amount),
        timestamp: new Date(Number(invoice.timestamp) * 1000).toISOString(),
        status: invoice.status,
        riskScore: invoice.riskScore,
        metadata: invoice.metadata
      };
    } catch (error) {
      console.error('Failed to get invoice:', error);
      throw error;
    }
  }

  async getUserInvoices(userAddress: string): Promise<string[]> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const invoiceHashes = await this.contract.getUserInvoices(userAddress);
      return invoiceHashes;
    } catch (error) {
      console.error('Failed to get user invoices:', error);
      throw error;
    }
  }

  async getNetwork(): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const network = await this.provider.getNetwork();
    return network.name;
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }
}

export const blockchainService = new BlockchainService();