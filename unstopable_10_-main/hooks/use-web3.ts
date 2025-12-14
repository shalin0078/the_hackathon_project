"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWeb3() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [networkName, setNetworkName] = useState("")
  const [balance, setBalance] = useState("0")
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)

  const EXPECTED_CHAIN_ID = 1 // Ethereum mainnet - adjust as needed

  const checkNetwork = useCallback(async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)
      setIsWrongNetwork(chainId !== EXPECTED_CHAIN_ID)

      // Set network name
      if (chainId === 1) setNetworkName("Ethereum")
      else if (chainId === 11155111) setNetworkName("Sepolia")
      else if (chainId === 137) setNetworkName("Polygon")
      else setNetworkName(`Chain ${chainId}`)
    } catch (error) {
      console.error("[v0] Error checking network:", error)
    }
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!provider || !address) return

    try {
      // Get MNEE token balance (placeholder - replace with actual token contract)
      // For demo, we'll simulate with ETH balance * 1000
      const ethBalance = await provider.getBalance(address)
      const mneeBalance = (Number(ethers.formatEther(ethBalance)) * 1000).toFixed(2)
      setBalance(mneeBalance)
    } catch (error) {
      console.error("[v0] Error fetching balance:", error)
    }
  }, [provider, address])

  const connect = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this app")
      return
    }

    try {
      const ethProvider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await ethProvider.send("eth_requestAccounts", [])
      const ethSigner = await ethProvider.getSigner()

      setProvider(ethProvider)
      setSigner(ethSigner)
      setAddress(accounts[0])
      setIsConnected(true)

      await checkNetwork(ethProvider)
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
    }
  }, [checkNetwork])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress("")
    setBalance("0")
    setProvider(null)
    setSigner(null)
  }, [])

  useEffect(() => {
    if (isConnected && provider) {
      refreshBalance()
    }
  }, [isConnected, provider, refreshBalance])

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAddress(accounts[0])
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [disconnect])

  return {
    isConnected,
    address,
    networkName,
    balance,
    isWrongNetwork,
    provider,
    signer,
    connect,
    disconnect,
    refreshBalance,
  }
}
