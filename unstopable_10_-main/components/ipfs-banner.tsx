"use client"

import { Globe } from "lucide-react"

export function IPFSBanner() {
  return (
    <div className="bg-primary/10 border-b border-primary/20 backdrop-blur">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Globe className="h-4 w-4 text-primary" />
          <p className="text-primary font-medium">This app is hosted on IPFS - Fully Decentralized</p>
        </div>
      </div>
    </div>
  )
}
