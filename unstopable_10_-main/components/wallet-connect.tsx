"use client"

import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface WalletConnectProps {
  isConnected: boolean
  address: string
  networkName: string
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletConnect({ isConnected, address, networkName, onConnect, onDisconnect }: WalletConnectProps) {
  const [copied, setCopied] = useState(false)

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isConnected) {
    return (
      <Button onClick={onConnect} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-primary/50 hover:bg-primary/10 bg-transparent">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse-glow" />
            <span className="font-mono text-sm hidden sm:inline">{truncateAddress(address)}</span>
            <span className="font-mono text-sm sm:hidden">Wallet</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Connected Wallet</span>
          <span className="text-xs text-muted-foreground font-normal">{networkName}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-mono text-xs flex items-center justify-between" onClick={copyAddress}>
          <span className="truncate">{address}</span>
          <Copy className="h-3 w-3 ml-2 flex-shrink-0" />
        </DropdownMenuItem>
        {copied && <div className="px-2 py-1 text-xs text-primary">Copied to clipboard!</div>}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-muted-foreground text-xs">
          <ExternalLink className="h-3 w-3 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDisconnect} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
