const { expect } = require("chai");
const { ethers } = require("hardhat");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe("InvoiceRegistry", function () {
  let contract, owner, payee, payer;
  const INVOICE_HASH = ethers.id("invoice-001");
  const AMOUNT = ethers.parseEther("1.0");
  const RISK_SCORE = 25;

  beforeEach(async function () {
    [owner, payee, payer] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("InvoiceRegistry");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("Invoice Submission", function () {
    it("Should submit invoice with valid parameters", async function () {
      await contract.connect(owner).submitInvoice(
        INVOICE_HASH, payee.address, AMOUNT, RISK_SCORE, "ipfs://metadata"
      );

      const invoice = await contract.getInvoice(INVOICE_HASH);
      expect(invoice.payee).to.equal(payee.address);
      expect(invoice.amount).to.equal(AMOUNT);
      expect(Number(invoice.riskScore)).to.equal(RISK_SCORE);
      expect(Number(invoice.status)).to.equal(0); // Submitted
    });

    it("Should reject duplicate invoice", async function () {
      await contract.connect(owner).submitInvoice(
        INVOICE_HASH, payee.address, AMOUNT, RISK_SCORE, "metadata"
      );
      
      await expect(
        contract.connect(owner).submitInvoice(
          INVOICE_HASH, payee.address, AMOUNT, RISK_SCORE, "metadata"
        )
      ).to.be.rejected;
    });
  });

  describe("Status Management", function () {
    beforeEach(async function () {
      await contract.connect(owner).submitInvoice(
        INVOICE_HASH, payee.address, AMOUNT, RISK_SCORE, "metadata"
      );
    });

    it("Should allow payee to update status", async function () {
      await contract.connect(payee).updateInvoiceStatus(INVOICE_HASH, 1);
      
      const invoice = await contract.getInvoice(INVOICE_HASH);
      expect(Number(invoice.status)).to.equal(1); // Approved
    });

    it("Should reject non-owner status update", async function () {
      await expect(
        contract.connect(payer).updateInvoiceStatus(INVOICE_HASH, 1)
      ).to.be.rejected;
    });
  });

  describe("Payment Processing", function () {
    beforeEach(async function () {
      await contract.connect(owner).submitInvoice(
        INVOICE_HASH, payee.address, AMOUNT, RISK_SCORE, "metadata"
      );
      await contract.connect(payee).updateInvoiceStatus(INVOICE_HASH, 1); // Approve
    });

    it("Should process payment successfully", async function () {
      const payeeBefore = await ethers.provider.getBalance(payee.address);

      await contract.connect(payer).processPayment(INVOICE_HASH, { value: AMOUNT });

      const payeeAfter = await ethers.provider.getBalance(payee.address);
      expect(payeeAfter - payeeBefore).to.equal(AMOUNT);
      
      const invoice = await contract.getInvoice(INVOICE_HASH);
      expect(Number(invoice.status)).to.equal(2); // Paid
    });

    it("Should reject payment for unapproved invoice", async function () {
      const newHash = ethers.id("invoice-002");
      await contract.connect(owner).submitInvoice(
        newHash, payee.address, AMOUNT, RISK_SCORE, "metadata"
      );

      await expect(
        contract.connect(payer).processPayment(newHash, { value: AMOUNT })
      ).to.be.rejected;
    });

    it("Should reject insufficient payment", async function () {
      await expect(
        contract.connect(payer).processPayment(INVOICE_HASH, { value: AMOUNT / 2n })
      ).to.be.rejected;
    });
  });

  describe("Query Functions", function () {
    it("Should retrieve user invoices", async function () {
      await contract.connect(owner).submitInvoice(
        INVOICE_HASH, payee.address, AMOUNT, RISK_SCORE, "metadata"
      );
      
      const userInvoices = await contract.getUserInvoices(payee.address);
      expect(userInvoices.length).to.equal(1);
      expect(userInvoices[0]).to.equal(INVOICE_HASH);
    });

    it("Should retrieve invoice details", async function () {
      await contract.connect(owner).submitInvoice(
        INVOICE_HASH, payee.address, AMOUNT, RISK_SCORE, "ipfs://test"
      );
      
      const invoice = await contract.getInvoice(INVOICE_HASH);
      expect(invoice.invoiceHash).to.equal(INVOICE_HASH);
      expect(invoice.payee).to.equal(payee.address);
      expect(invoice.amount).to.equal(AMOUNT);
      expect(invoice.metadata).to.equal("ipfs://test");
    });
  });
});
