// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AdvancedInvoiceRegistry is Ownable {
    using Strings for uint256;

    // --- Structs & Enums ---
    struct Invoice {
        bytes32 invoiceHash;
        address payee;
        address payer;          // Track who is expected to pay
        uint256 amount;
        uint256 timestamp;
        uint256 dueDate;        // New: Deadline for payment
        InvoiceStatus status;
        uint8 riskScore;        // 0-100 (validated)
        string metadata;        // IPFS CID or JSON string
        bool isDisputed;        // New: Dispute flag
    }

    enum InvoiceStatus {
        Submitted,
        Approved,
        Paid,
        Rejected,
        Disputed,              // New: Dispute state
        Overdue                // New: Auto-set if dueDate passed
    }

    // --- State Variables ---
    using Counters for Counters.Counter;
    Counters.Counter private _invoiceCount;  // Track total invoices

    mapping(bytes32 => Invoice) public invoices;
    mapping(address => bytes32[]) public userInvoices;
    mapping(bytes32 => address[]) public invoiceApprovers;  // Multi-approval support

    // --- Events ---
    event InvoiceSubmitted(
        bytes32 indexed invoiceHash,
        address indexed payee,
        uint256 amount,
        uint256 dueDate
    );
    event InvoiceApproved(
        bytes32 indexed invoiceHash,
        address indexed approver,
        uint256 timestamp
    );
    event InvoiceDisputed(bytes32 indexed invoiceHash, string reason);
    event PaymentProcessed(
        bytes32 indexed invoiceHash,
        uint256 amount,
        uint256 feeDeducted  // New: Track platform fees
    );
    event OverdueInvoice(bytes32 indexed invoiceHash, uint256 dueDate);

    // --- Errors ---
    error InvoiceRegistry__NotInvoiceOwner(address caller, address owner);
    error InvoiceRegistry__InvalidRiskScore(uint8 score);
    error InvoiceRegistry__PaymentFailed(address payee);
    error InvoiceRegistry__InvoiceOverdue(uint256 dueDate);
    error InvoiceRegistry__UnauthorizedApprover(address approver);

    // --- Modifiers ---
    modifier onlyInvoiceOwner(bytes32 _invoiceHash) {
        if (invoices[_invoiceHash].payee != msg.sender) {
            revert InvoiceRegistry__NotInvoiceOwner(msg.sender, invoices[_invoiceHash].payee);
        }
        _;
    }

    modifier validRiskScore(uint8 _riskScore) {
        if (_riskScore > 100) revert InvoiceRegistry__InvalidRiskScore(_riskScore);
        _;
    }

    // --- Core Functions ---
    function submitInvoice(
        bytes32 _invoiceHash,
        address _payer,
        uint256 _amount,
        uint256 _dueDate,  // Unix timestamp
        uint8 _riskScore,
        string memory _metadata
    ) external validRiskScore {
        require(invoices[_invoiceHash].timestamp == 0, "Invoice already exists");
        require(_dueDate > block.timestamp, "Due date must be in the future");
        require(_amount > 0, "Amount must be > 0");

        _invoiceCount.increment();
        invoices[_invoiceHash] = Invoice({
            invoiceHash: _invoiceHash,
            payee: msg.sender,
            payer: _payer,
            amount: _amount,
            timestamp: block.timestamp,
            dueDate: _dueDate,
            status: InvoiceStatus.Submitted,
            riskScore: _riskScore,
            metadata: _metadata,
            isDisputed: false
        });

        userInvoices[msg.sender].push(_invoiceHash);
        emit InvoiceSubmitted(_invoiceHash, msg.sender, _amount, _dueDate);
    }

    // Multi-approval system (e.g., for corporate invoices)
    function addApprover(bytes32 _invoiceHash, address _approver) external onlyInvoiceOwner(_invoiceHash) {
        invoiceApprovers[_invoiceHash].push(_approver);
    }

    function approveInvoice(bytes32 _invoiceHash) external {
        require(
            invoices[_invoiceHash].payee == msg.sender ||
            _isApprover(_invoiceHash, msg.sender),
            "Not authorized"
        );
        require(invoices[_invoiceHash].status == InvoiceStatus.Submitted, "Invalid status");

        invoices[_invoiceHash].status = InvoiceStatus.Approved;
        emit InvoiceApproved(_invoiceHash, msg.sender, block.timestamp);
    }

    // Dispute mechanism
    function disputeInvoice(bytes32 _invoiceHash, string memory reason)
        external
        onlyInvoiceOwner(_invoiceHash)
    {
        require(!invoices[_invoiceHash].isDisputed, "Already disputed");
        invoices[_invoiceHash].status = InvoiceStatus.Disputed;
        invoices[_invoiceHash].isDisputed = true;
        emit InvoiceDisputed(_invoiceHash, reason);
    }

    // Enhanced payment processing with fee deduction
    function processPayment(bytes32 _invoiceHash) external payable {
        Invoice storage invoice = invoices[_invoiceHash];
        require(invoice.status == InvoiceStatus.Approved, "Invoice not approved");
        require(block.timestamp <= invoice.dueDate, "Invoice overdue");
        require(msg.value >= invoice.amount, "Insufficient payment");

        // Deduct 1% platform fee (example)
        uint256 fee = (invoice.amount * 1) / 100;
        uint256 payeeAmount = invoice.amount - fee;

        // Transfer logic with error handling
        payable(invoice.payee).transfer(payeeAmount);
        payable(owner()).transfer(fee);  // Send fee to contract owner

        if (msg.value > invoice.amount) {
            payable(msg.sender).transfer(msg.value - invoice.amount);
        }

        invoice.status = InvoiceStatus.Paid;
        emit PaymentProcessed(_invoiceHash, payeeAmount, fee);
    }

    // --- View Functions ---
    function getInvoice(bytes32 _invoiceHash) external view returns (Invoice memory) {
        return invoices[_invoiceHash];
    }

    function getUserInvoices(address _user) external view returns (bytes32[] memory) {
        return userInvoices[_user];
    }

    function getInvoiceStatus(bytes32 _invoiceHash) external view returns (InvoiceStatus) {
        _checkOverdue(_invoiceHash);  // Auto-update status if overdue
        return invoices[_invoiceHash].status;
    }

    // --- Internal Helpers ---
    function _isApprover(bytes32 _invoiceHash, address _approver) internal view returns (bool) {
        for (uint i = 0; i < invoiceApprovers[_invoiceHash].length; i++) {
            if (invoiceApprovers[_invoiceHash][i] == _approver) return true;
        }
        return false;
    }

    function _checkOverdue(bytes32 _invoiceHash) internal {
        if (
            invoices[_invoiceHash].status != InvoiceStatus.Paid &&
            block.timestamp > invoices[_invoiceHash].dueDate
        ) {
            invoices[_invoiceHash].status = InvoiceStatus.Overdue;
            emit OverdueInvoice(_invoiceHash, invoices[_invoiceHash].dueDate);
        }
    }

    // --- Admin Functions (Ownable) ---
    function updateRiskScore(bytes32 _invoiceHash, uint8 _newScore)
        external
        onlyOwner
        validRiskScore(_newScore)
    {
        invoices[_invoiceHash].riskScore = _newScore;
    }

    function resolveDispute(bytes32 _invoiceHash, InvoiceStatus _newStatus)
        external
        onlyOwner
    {
        require(invoices[_invoiceHash].isDisputed, "Not disputed");
        invoices[_invoiceHash].status = _newStatus;
        invoices[_invoiceHash].isDisputed = false;
    }
}