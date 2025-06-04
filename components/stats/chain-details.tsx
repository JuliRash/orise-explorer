"use client"

import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CircleIcon, 
  GitBranchIcon, 
  CodeIcon,
  NetworkIcon,
  PackageIcon,
  ServerIcon
} from "lucide-react"
import { fetchWithCors, REST_API_URL } from "@/lib/api-utils"

interface ChainInfo {
  network: string
  chainId: string
  version: string
  moniker: string
  nodeVersion: string
  protocolVersion: {
    p2p: string
    block: string
    app: string
  }
}

export function ChainDetails() {
  const { data: chainInfo, isLoading } = useQuery<ChainInfo>({
    queryKey: ["chainInfo"],
    queryFn: async () => {
      const response = await fetchWithCors(`${REST_API_URL}/cosmos/base/tendermint/v1beta1/node_info`)
      const data = await response.json()
      
      // Format network name based on network ID
      const networkId = data.default_node_info.network
      const isTestnet = networkId.includes('testnet') || networkId.includes('9000')
      const networkName = isTestnet ? 'Universe Chain Testnet' : 'Universe Chain Mainnet'
      
      return {
        network: networkName,
        chainId: data.default_node_info.network,
        version: data.application_version.version,
        moniker: data.default_node_info.moniker,
        nodeVersion: data.default_node_info.version,
        protocolVersion: data.default_node_info.protocol_version
      }
    },
    refetchInterval: 1000,
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading chain information...</div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <NetworkIcon className="w-5 h-5" />
            Network Details
          </h2>
          <p className="text-sm text-muted-foreground">Current state of the Universe Chain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Network</div>
            <div className="flex items-center gap-2">
              <CircleIcon className="w-3 h-3 text-green-500" />
              <span className="font-medium">{chainInfo?.network}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Chain ID</div>
            <div className="flex items-center gap-2">
              <GitBranchIcon className="w-4 h-4" />
              <span className="font-medium">{chainInfo?.chainId}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Version</div>
            <div className="flex items-center gap-2">
              <CodeIcon className="w-4 h-4" />
              <span className="font-medium">{chainInfo?.version}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Node Name</div>
            <div className="flex items-center gap-2">
              <ServerIcon className="w-4 h-4" />
              <span className="font-medium">{chainInfo?.moniker}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Node Version</div>
            <div className="flex items-center gap-2">
              <PackageIcon className="w-4 h-4" />
              <span className="font-medium">{chainInfo?.nodeVersion}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Protocol Version</div>
            <div className="flex gap-2">
              <Badge variant="outline">P2P: {chainInfo?.protocolVersion.p2p}</Badge>
              <Badge variant="outline">Block: {chainInfo?.protocolVersion.block}</Badge>
              <Badge variant="outline">App: {chainInfo?.protocolVersion.app}</Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 