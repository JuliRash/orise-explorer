"use client"

import { Download, Filter, Info, X, ArrowDownWideNarrow, Copy, CircleHelp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import Image from "next/image"

interface TokenTransfer {
  hash: string
  method: string
  block: string
  age: string
  from: string
  to: string
  amount: string
  token: {
    symbol: string
    name: string
    logo: string
  }
  type: "IN" | "OUT"
}

interface TokenTransfersProps {
  address: string
}

export function TokenTransfers({ address }: TokenTransfersProps) {
  const transfers: TokenTransfer[] = [
    {
      hash: "0xbb7007448f...",
      method: "Transfer",
      block: "30010385",
      age: "507 days ago",
      from: "0xa1b2c3d4e5f6789",
      to: "0xdeadbeefdeadbeef",
      amount: "200",
      token: {
        symbol: "S39",
        name: "S39 Token",
        logo: "/token-logos/s39.png"
      },
      type: "IN"
    },
    {
      hash: "0xbb7007448f...",
      method: "Transfer",
      block: "30010385",
      age: "507 days ago",
      from: "0xa1b2c3d4e5f6789",
      to: "0xdeadbeefdeadbeef",
      amount: "200",
      token: {
        symbol: "S39",
        name: "S39 Token",
        logo: "/token-logos/s39.png"
      },
      type: "IN"
    }
  ]

  return (
    <div className="space-y-4 border rounded-lg">
      <div className="p-3">
        <Alert className="bg-input ">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm text-muted-foreground flex items-center justify-between ">
            <span>
              Transactions involving tokens marked as suspicious, unsafe, spam or brand infringement are currently hidden. To show them, go to{" "}
              <Link href="/settings" className="text-primary hover:underline">
                Site Settings
              </Link>
              .
            </span>
            <Button variant="destructive" size="sm" className="text-muted-foreground h-auto p-0">
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      </div>


      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 justify-between mb-4 p-3">
        <div className="flex hap-2 text-sm text-muted-foreground">
          <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
          Latest 23 from a total of 23 transactions
        </div>
        <div className="flex items-start gap-2">

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Page Data
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="flex gap-1 items-center">
              <CircleHelp className="h-4 w-4 text-gray-400" />
            </TableHead>
            <TableHead>Transaction Hash</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Block</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Token</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.map((transfer, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium !py-0">
                <Button variant="link" className="p-2 border h-auto font-normal flex gap-2 ">
                  <Eye className="h-3 w-3 text-gray-400" />
                </Button>
              </TableCell>
              <TableCell className="font-medium !py-0">
                <Link
                  href={`/tx/${transfer.hash}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {transfer.hash}
                </Link>
              </TableCell>
              <TableCell className="font-medium !py-0">
                <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                  {transfer.method}
                </span>
              </TableCell>
              <TableCell className="font-medium !py-0">
                <Link
                  href={`/block/${transfer.block}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {transfer.block}
                </Link>
              </TableCell>
              <TableCell className="font-medium !py-0">{transfer.age}</TableCell>
              <TableCell className="font-medium !py-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/address/${transfer.from}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {transfer.from}
                  </Link>
                  {transfer.type === "OUT" && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">
                      OUT
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium !py-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/address/${transfer.to}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {transfer.to}
                  </Link>
                  {transfer.type === "IN" && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                      IN
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium !py-0">{transfer.amount}</TableCell>
              <TableCell className="font-medium !py-0">
                <div className="flex items-center gap-2">
                  <Image
                    src={transfer.token.logo}
                    alt={transfer.token.symbol}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span>{transfer.token.symbol}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}