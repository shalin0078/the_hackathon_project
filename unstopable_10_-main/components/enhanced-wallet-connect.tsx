"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Wallet, 
  ChevronDown, 
  Copy, 
  ExternalLink, 
  LogOut, 
  Settings,
  Shield,
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface Network {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorer: string
  color: string
  isTestnet: boolean
}

interface EnhancedWalletConnectProps {
  isConnected: boolean
  address?: string
  networkName?: string
  balance?: string
  onConnect: () => void
  onDisconnect: () => void
  onNetworkSwitch?: (networkId: number) => void
}

export function EnhancedWalletConnect({
  isConnected,
  address,
  networkName,
  balance,
  onConnect,
  onDisconnect,
  onNetworkSwitch
}: EnhancedWalletConnectProps) {
  const [showNetworkSelector, setShowNetworkSelector] = useState(false)

  const networks: Network[] = [
    {
      id: 1,
      name: "Ethereum Mainnet",
      symbol: "ETH",
      rpcUrl: "https://mainnet.infura.io/v3/",
      blockExplorer: "https://etherscan.io",
      color: "bg-blue-500",
      isTestnet: false
    },
    {
      id: 11155111,
      name: "Sepolia Testnet",
      symbol: "SepoliaETH",
      rpcUrl: "https://sepolia.infura.io/v3/",
      blockExplorer: "https://sepolia.etherscan.io",
      color: "bg-purple-500",
      isTestnet: true
    },
    {
      id: 137,
      name: "Polygon Mainnet",
      symbol: "MATIC",
      rpcUrl: "https://polygon-rpc.com",
      blockExplorer: "https://polygonscan.com",
      color: "bg-purple-600",
      isTestnet: false
    },
    {
      id: 80001,
      name: "Mumbai Testnet",
      symbol: "MATIC",
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
      blockExplorer: "https://mumbai.polygonscan.com",
      color: "bg-purple-400",
      isTestnet: true
    },
    {
      id: 56,
      name: "BSC Mainnet",
      symbol: "BNB",
      rpcUrl: "https://bsc-dataseed.binance.org",
      blockExplorer: "https://bscscan.com",
      color: "bg-yellow-500",
      isTestnet: false
    },
    {
      id: 97,
      name: "BSC Testnet",
      symbol: "tBNB",
      rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
      blockExplorer: "https://testnet.bscscan.com",
      color: "bg-yellow-400",
      isTestnet: true
    }
  ]

  const currentNetwork = networks.find(n => n.name.toLowerCase().includes(networkName?.toLowerCase() || ""))
  const isWrongNetwork = isConnected && !currentNetwork

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const openInExplorer = () => {
    if (currentNetwork && address) {
      window.open(`${currentNetwork.blockExplorer}/address/${address}`, '_blank')
    }
  }

  const switchNetwork = async (network: Network) => {
    if (onNetworkSwitch) {
      onNetworkSwitch(network.id)
    }
    setShowNetworkSelector(false)
  }

  if (!isConnected) {
    return (
      <Button onClick={onConnect} className="bg-primary hover:bg-primary/90">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Network Selector */}
      <DropdownMenu open={showNetworkSelector} onOpenChange={setShowNetworkSelector}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${isWrongNetwork ? 'border-destructive/50 bg-destructive/10' : ''}`}
          >
            {currentNetwork ? (
              <>
                <div className={`w-2 h-2 rounded-full ${currentNetwork.color}`} />
                <span className="hidden sm:inline">{currentNetwork.name}</span>
                <span className="sm:hidden">{currentNetwork.symbol}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="text-destructive">Wrong Network</span>
              </>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2">
            <p className="text-sm font-medium mb-2">Select Network</p>
            <div className="space-y-1">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => switchNetwork(network)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className={`w-3 h-3 rounded-full ${network.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{network.name}</span>
                      {network.isTestnet && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          Testnet
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{network.symbol}</p>
                  </div>
                  {currentNetwork?.id === network.id && (
                    <CheckCircle className="h-4 w-4 text-chart-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Wallet Info */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-chart-2" />
              <span className="font-mono text-sm">{truncateAddress(address || "")}</span>
            </div>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-4">
            <Card className="border-0 shadow-none bg-muted/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Wallet Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Address</p>
                  <div className="flex items-center gap-2 p-2 bg-background rounded border">
                    <span className="font-mono text-sm flex-1">{address}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(address || "")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Balance */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Balance</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{balance || "0.00"} MNEE</span>
                    <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                      Native Token
                    </Badge>
                  </div>
                </div>

                {/* Network */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Network</p>
                  <div className="flex items-center gap-2">
                    {currentNetwork && (
                      <>
                        <div className={`w-3 h-3 rounded-full ${currentNetwork.color}`} />
                        <span className="text-sm font-medium">{currentNetwork.name}</span>
                        {currentNetwork.isTestnet && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            Testnet
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInExplorer}
                    className="flex-1"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Explorer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNetworkSelector(true)}
                    className="flex-1"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Network
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onDisconnect} className="text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}