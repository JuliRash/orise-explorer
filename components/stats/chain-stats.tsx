"use client"

import { useQuery } from "@tanstack/react-query"
import { StatsCard } from "./stats-card"
import { 
  Network,
  BarChart3
} from "lucide-react"
import { fetchWithCors, REST_API_URL, RPC_API_URL } from "@/lib/api-utils"

export function ChainStats() {
  // Fetch status data
  const { data: statusData } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      const response = await fetchWithCors(`${RPC_API_URL}/status`);
      const data = await response.json();
      
      // Extract block information
      const latestBlock = parseInt(data.result.sync_info.latest_block_height);
      const latestBlockTime = new Date(data.result.sync_info.latest_block_time);
      const blockTimeSeconds = ((Date.now() - latestBlockTime.getTime()) / 1000).toFixed(1);
      
      return {
        latestBlock,
        blockTime: `${blockTimeSeconds}s`,
        gasPrice: "1 Gwei ($0.01)"
      };
    },
    refetchInterval: 1000,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Fetch transaction data
  const { data: txStats } = useQuery({
    queryKey: ["txStats"],
    queryFn: async () => {
      // Fetch voting power from validators
      const validatorsResponse = await fetchWithCors(`${REST_API_URL}/cosmos/staking/v1beta1/validators`);
      const validatorsData = await validatorsResponse.json();
      
      // Calculate total tokens (converting from atucc with 18 decimals to UCC)
      const totalTokens = validatorsData.validators.reduce((sum: number, validator: any) => {
        return sum + (parseInt(validator.tokens) / Math.pow(10, 18));
      }, 0);
      
      return {
        totalTx: 0, // No transactions yet
        tps: "0.0",
        votingPower: `${(totalTokens / 1000).toFixed(0)}K UCC`,
        shares: `${(totalTokens / 1000).toFixed(0)}K shares`
      };
    },
    refetchInterval: 1000,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      <StatsCard
        title="NETWORK STATS"
        icon={Network}
        items={[
          {
            label: "Latest Block",
            value: statusData ? `${statusData.latestBlock} (${statusData.blockTime})` : "Loading..."
          },
          {
            label: "Gas Price",
            value: statusData?.gasPrice || "1 Gwei ($0.01)"
          }
        ]}
      />
      
    
    </div>
  )
}