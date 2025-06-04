"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/ui/data-table"

interface Token {
  rank: number
  name: string
  symbol: string
  volume: number
  transfers: number
  marketCap: number
}

export function TokenTable() {
  const { data: tokens } = useQuery<Token[]>({
    queryKey: ["top-tokens"],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return Array(5).fill(null).map((_, i) => ({
        rank: i + 1,
        name: "Tether USD",
        symbol: "USDT",
        volume: 18602511705,
        transfers: 2325495,
        marketCap: 61773631706
      }))
    }
  })

  const columns = [
    {
      header: "#",
      accessorKey: "rank" as const
    },
    {
      header: "Token",
      accessorKey: "name" as const,
      cell: (token: Token) => (
        <div className="flex items-center space-x-2">
          <span>{token.name}</span>
          <span className="text-sm text-muted-foreground">({token.symbol})</span>
        </div>
      )
    },
    {
      header: "Transfer Volume ($)",
      accessorKey: "volume" as const,
      cell: (token: Token) => `$${token.volume.toLocaleString()}`
    },
    {
      header: "Transfers (#)",
      accessorKey: "transfers" as const,
      cell: (token: Token) => token.transfers.toLocaleString()
    },
    {
      header: "Market Cap",
      accessorKey: "marketCap" as const,
      cell: (token: Token) => `$${token.marketCap.toLocaleString()}`
    }
  ]

  return <DataTable columns={columns} data={tokens || []} />
}