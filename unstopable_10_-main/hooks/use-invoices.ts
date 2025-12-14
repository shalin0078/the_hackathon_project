"use client"

import { useState, useEffect } from "react"

export interface Invoice {
  id: string
  payer: string
  payee: string
  amount: string
  status: "pending" | "paid"
  risk: "low" | "medium" | "high"
  date: string
  description: string
  txHash: string
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    // Initialize with demo invoices
    const demoInvoices: Invoice[] = [
      {
        id: "INV001",
        payer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        payee: "0x8e23Ee67d1332aD560396262C48ffbB273f626A4",
        amount: "1250.00",
        status: "pending",
        risk: "low",
        date: "2024-01-15",
        description: "Web development services",
        txHash: "0x1234567890abcdef",
      },
      {
        id: "INV002",
        payer: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c",
        payee: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        amount: "750.50",
        status: "paid",
        risk: "low",
        date: "2024-01-12",
        description: "Consulting services",
        txHash: "0xabcdef1234567890",
      },
      {
        id: "INV003",
        payer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        payee: "0x1234567890123456789012345678901234567890",
        amount: "3500.00",
        status: "pending",
        risk: "high",
        date: "2024-01-14",
        description: "Large payment - verify recipient",
        txHash: "",
      },
    ]
    setInvoices(demoInvoices)
  }, [])

  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [invoice, ...prev])
  }

  const updateInvoiceStatus = (id: string, status: "pending" | "paid") => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)))
  }

  return {
    invoices,
    addInvoice,
    updateInvoiceStatus,
  }
}
