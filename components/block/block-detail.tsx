"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Clock, Server, Hash, Layers, Package } from "lucide-react"
import Link from "next/link"
import { fetchWithCors, RPC_API_URL } from "@/lib/api-utils"

interface BlockDetailProps {
  height: number
}

interface BlockData {
  height: number
  hash: string
  time: string
  proposer: string
  txCount: number
  transactions: Array<{
    hash: string
    index: number
  }>
  validatorCount: number
}

export function BlockDetail({ height }: BlockDetailProps) {
  const { data: block, isLoading } = useQuery<BlockData>({
    queryKey: ["block", height],
    queryFn: async () => {
      // Fetch block details from the Tendermint API
      const response = await fetchWithCors(`${RPC_API_URL}/block?height=${height}`);
      
      if (!response.ok) {
        throw new Error('Block not found');
      }
      
      const data = await response.json();
      const blockData = data.result.block;
      
      // Extract transactions
      const transactions = (blockData.data.txs || []).map((txHash: string, index: number) => ({
        hash: txHash,
        index
      }));
      
      return {
        height: height,
        hash: blockData.header.app_hash,
        time: blockData.header.time,
        proposer: blockData.header.proposer_address,
        txCount: transactions.length,
        transactions: transactions,
        validatorCount: parseInt(blockData.header.num_txs || '0')
      };
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!block) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">Block Not Found</h3>
            <p className="text-muted-foreground">
              Could not find block with height {height}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Block Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Layers className="h-4 w-4" /> Block Height
                </div>
                <div className="font-medium">{block.height}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Timestamp
                </div>
                <div>{new Date(block.time).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package className="h-4 w-4" /> Transactions
                </div>
                <div>{block.txCount} transaction{block.txCount !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Hash className="h-4 w-4" /> Block Hash
                </div>
                <div className="font-mono text-sm break-all">{block.hash}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Server className="h-4 w-4" /> Proposer
                </div>
                <div className="font-mono text-sm break-all">{block.proposer}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {block.txCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Transactions ({block.txCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {block.transactions.map((tx, index) => (
                <div 
                  key={index} 
                  className="border p-3 rounded-md hover:bg-muted"
                >
                  <Link href={`/tx/${tx.hash}`} className="flex justify-between items-center">
                    <div className="font-mono text-sm truncate max-w-[70%]">
                      {tx.hash}
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                      Tx #{tx.index + 1}
                    </div>
                  </Link>
                </div>
              ))}
              
              {block.txCount > 10 && (
                <div className="text-center mt-4">
                  <Link 
                    href={`/block/${height}/txs`}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    View all {block.txCount} transactions
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 