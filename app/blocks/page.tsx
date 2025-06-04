"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Loader2, ArrowDownWideNarrow, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchWithCors, REST_API_URL } from "@/lib/api-utils"
import { SearchBar } from "@/components/search-bar"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Block {
  height: string
  hash: string
  time: string
  proposer: string
  txCount: number
}

const ITEMS_PER_PAGE = 50

export default function BlocksPage() {
  const [page, setPage] = useState(1)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["allBlocks", page],
    queryFn: async () => {
      try {
        const latestBlockResponse = await fetchWithCors(
          `${REST_API_URL}/cosmos/base/tendermint/v1beta1/blocks/latest`
        )
        
        if (!latestBlockResponse.ok) {
          throw new Error('Failed to fetch latest block')
        }
        
        const latestBlockData = await latestBlockResponse.json()
        const latestHeight = parseInt(latestBlockData.block.header.height)
        const startHeight = Math.max(1, latestHeight - ((page - 1) * ITEMS_PER_PAGE))
        
        const blocks = await Promise.all(
          Array.from({ length: Math.min(ITEMS_PER_PAGE, startHeight) }, async (_, i) => {
            const height = startHeight - i
            const response = await fetchWithCors(
              `${REST_API_URL}/cosmos/base/tendermint/v1beta1/blocks/${height}`
            )
            if (!response.ok) return null
            const data = await response.json()
            return data
          })
        )

        const validBlocks = blocks.filter(block => block !== null)

        return {
          blocks: validBlocks.map(data => ({
            height: data.block.header.height,
            hash: data.block_id.hash,
            time: new Date(data.block.header.time).toLocaleString(),
            proposer: data.block.header.proposer_address,
            txCount: data.block.data.txs ? data.block.data.txs.length : 0
          })),
          total: latestHeight
        }
      } catch (err) {
        console.error('Error fetching blocks:', err)
        throw err
      }
    },
    refetchInterval: 5000,
    retry: 3,
  })

  const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE)

  if (error) {
    return (
      <div className="container-fluid mx-auto">
        <div className="bg-card w-full py-6 shadow-sm mb-6">
          <div className="w-full md:w-[60%] px-6">
            <SearchBar />
          </div>
        </div>
        <Card>
          <CardHeader className="flex flex-col space-y-2 pb-4">
            <CardTitle className="text-2xl font-bold">Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8 text-red-500">
              Error loading blocks. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container-fluid mx-auto">
        <div className="bg-card w-full py-6 shadow-sm mb-6">
          <div className="w-full md:w-[60%] px-6">
            <SearchBar />
          </div>
        </div>
        <Card>
          <CardHeader className="flex flex-col space-y-2 pb-4">
            <CardTitle className="text-2xl font-bold">Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container-fluid mx-auto">
      <div className="bg-card w-full py-6 shadow-sm mb-6">
        <div className="w-full md:w-[60%] px-6">
          <SearchBar />
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-col space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold">Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 justify-between mb-4">
            <div className="flex gap-2 text-sm text-muted-foreground">
              <ArrowDownWideNarrow className="h-4 w-4" />
              Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, data?.total || 0)} out of {data?.total || 0} blocks
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Data
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Height</TableHead>
                <TableHead>Block Hash</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Proposer</TableHead>
                <TableHead>Txs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.blocks.map((block: Block) => (
                <TableRow key={block.height}>
                  <TableCell>
                    <Link href={`/block/${block.height}`} className="text-primary hover:text-primary/90 font-medium">
                      {block.height}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {block.hash.slice(0, 10)}...{block.hash.slice(-8)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{block.time}</TableCell>
                  <TableCell>
                    <Link href={`/address/${block.proposer}`} className="text-primary hover:text-primary/90">
                      {block.proposer.slice(0, 10)}...{block.proposer.slice(-8)}
                    </Link>
                  </TableCell>
                  <TableCell>{block.txCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 