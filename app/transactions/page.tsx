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

interface Transaction {
  hash: string
  time: string
  from: string
  to: string
  amount: string
  status: "Success" | "Failed"
}

const ITEMS_PER_PAGE = 50

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["allTransactions", page],
    queryFn: async () => {
      try {
        const response = await fetchWithCors(
          `${REST_API_URL}/cosmos/tx/v1beta1/txs?events=message.module='bank'&pagination.offset=${(page - 1) * ITEMS_PER_PAGE}&pagination.limit=${ITEMS_PER_PAGE}&order_by=ORDER_BY_DESC`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }
        
        const data = await response.json()
        
        if (!data.tx_responses) {
          return {
            transactions: [],
            total: 0
          }
        }

        return {
          transactions: data.tx_responses.map((tx: any) => {
            let from = "", to = "", amount = "0 UCC"
            
            try {
              if (tx.logs && tx.logs.length > 0) {
                const events = tx.logs[0].events
                const transferEvent = events.find((event: any) => 
                  event.type === "transfer" || event.type === "coin_spent"
                )
                
                if (transferEvent) {
                  const amountAttr = transferEvent.attributes.find((attr: any) => 
                    attr.key === "amount" || attr.key === "value"
                  )
                  if (amountAttr && amountAttr.value) {
                    const rawAmount = amountAttr.value.replace('atucc', '')
                    const value = (BigInt(rawAmount) * BigInt(100) / BigInt(10 ** 18)) / BigInt(100)
                    amount = `${value.toString()} UCC`
                  }
                }

                const messageEvent = events.find((event: any) => event.type === "message")
                if (messageEvent) {
                  const senderAttr = messageEvent.attributes.find((attr: any) => attr.key === "sender")
                  const recipientAttr = events.find((event: any) => event.type === "coin_received")
                    ?.attributes.find((attr: any) => attr.key === "receiver")
                  
                  if (senderAttr) from = senderAttr.value
                  if (recipientAttr) to = recipientAttr.value
                }
              }
            } catch (err) {
              console.error('Error parsing transaction:', err)
            }

            return {
              hash: tx.txhash,
              time: new Date(tx.timestamp).toLocaleString(),
              from,
              to,
              amount,
              status: tx.code === 0 ? "Success" : "Failed"
            }
          }),
          total: parseInt(data.pagination?.total || "0")
        }
      } catch (err) {
        console.error('Error fetching transactions:', err)
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
            <CardTitle className="text-2xl font-bold">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8 text-red-500">
              Error loading transactions. Please try again later.
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
            <CardTitle className="text-2xl font-bold">Transactions</CardTitle>
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
          <CardTitle className="text-2xl font-bold">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 justify-between mb-4">
            <div className="flex gap-2 text-sm text-muted-foreground">
              <ArrowDownWideNarrow className="h-4 w-4" />
              Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, data?.total || 0)} out of {data?.total || 0} transactions
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Data
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Txn Hash</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.transactions.map((tx: Transaction) => (
                <TableRow key={tx.hash}>
                  <TableCell>
                    <Link href={`/tx/${tx.hash}`} className="text-primary hover:text-primary/90 font-medium">
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tx.time}</TableCell>
                  <TableCell>
                    <Link href={`/address/${tx.from}`} className="text-primary hover:text-primary/90">
                      {tx.from ? `${tx.from.slice(0, 10)}...${tx.from.slice(-8)}` : '-'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/address/${tx.to}`} className="text-primary hover:text-primary/90">
                      {tx.to ? `${tx.to.slice(0, 10)}...${tx.to.slice(-8)}` : '-'}
                    </Link>
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {tx.status}
                    </span>
                  </TableCell>
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