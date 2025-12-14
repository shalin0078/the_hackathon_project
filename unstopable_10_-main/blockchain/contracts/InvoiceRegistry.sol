// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

contract InvoiceRegistry {
    struct Invoice {
        bytes32 invoiceHash;
        address payee;
        uint256 amount;
        uint256 timestamp;
        InvoiceStatus status;
        uint8 riskScore;
        string metadata;
    }
    
    enum InvoiceStatus {
        Submitted,
        Approved,
        Paid,
        Rejected
    }
    
    mapping(bytes32 => Invoice) public invoices;
    mapping(address => bytes32[]) public userInvoices;
    
    event InvoiceSubmitted(bytes32 indexed invoiceHash, address indexed payee, uint256 amount);
    event InvoiceStatusUpdated(bytes32 indexed invoiceHash, InvoiceStatus status);
    event PaymentProcessed(bytes32 indexed invoiceHash, uint256 amount);
    
    modifier onlyInvoiceOwner(bytes32 _invoiceHash) {
        require(invoices[_invoiceHash].payee == msg.sender, "Not invoice owner");
        _;
    }
    
    function submitInvoice(
        bytes32 _invoiceHash,
        address _payee,
        uint256 _amount,
        uint8 _riskScore,
        string memory _metadata
    ) external {
        require(invoices[_invoiceHash].timestamp == 0, "Invoice already exists");
        
        invoices[_invoiceHash] = Invoice({
            invoiceHash: _invoiceHash,
            payee: _payee,
            amount: _amount,
            timestamp: block.timestamp,
            status: InvoiceStatus.Submitted,
            riskScore: _riskScore,
            metadata: _metadata
        });
        
        userInvoices[_payee].push(_invoiceHash);
        
        emit InvoiceSubmitted(_invoiceHash, _payee, _amount);
    }
    
    function updateInvoiceStatus(bytes32 _invoiceHash, InvoiceStatus _status) 
        external 
        onlyInvoiceOwner(_invoiceHash) 
    {
        invoices[_invoiceHash].status = _status;
        emit InvoiceStatusUpdated(_invoiceHash, _status);
    }
    
    function processPayment(bytes32 _invoiceHash) external payable {
        Invoice storage invoice = invoices[_invoiceHash];
        require(invoice.status == InvoiceStatus.Approved, "Invoice not approved");
        require(msg.value >= invoice.amount, "Insufficient payment");
        
        invoice.status = InvoiceStatus.Paid;
        
        payable(invoice.payee).transfer(invoice.amount);
        
        if (msg.value > invoice.amount) {
            payable(msg.sender).transfer(msg.value - invoice.amount);
        }
        
        emit PaymentProcessed(_invoiceHash, invoice.amount);
    }
    
    function getInvoice(bytes32 _invoiceHash) external view returns (Invoice memory) {
        return invoices[_invoiceHash];
    }
    
    function getUserInvoices(address _user) external view returns (bytes32[] memory) {
        return userInvoices[_user];
    }
}