"use client"

import { Download, ArrowDownWideNarrow, Copy, CircleHelp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AddressTransactionsProps {
  address: string
}

export function AddressTransactions({ address }: AddressTransactionsProps) {
  const transactions = Array(10).fill({
    hash: "UC4e5acf96..5fe33d23f",
    method: "Transfer",
    block: "43477480",
    age: "421 days ago",
    from: "UC4e5acf96..5fe33d23f",
    to: "UC4e5acf96..5fe33d23f",
    value: "0.029937",
    txnFee: "0.000063"
  })

  return (
    <div>
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
        <TableHeader className="">
          <TableRow className="!font-bold">
            <TableHead>
            <CircleHelp className="h-4 w-4 text-gray-400" />
            
            </TableHead>
            <TableHead >Transaction Hash</TableHead>
            <TableHead className="flex gap-1 items-center">Method
            <CircleHelp className="h-4 w-4 text-gray-400" />
            </TableHead>
            <TableHead>Block</TableHead>
            <TableHead className="w-full">Age</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Txn Fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, i) => (
            <TableRow key={i} className="!py-0">
              <TableCell className="font-medium">
                <Button variant="link" className="p-2 border h-auto font-normal flex gap-2 ">
                  <Eye className="h-3 w-3 text-gray-400" />
                </Button>
              </TableCell>
              <TableCell className="font-medium !py-0">
                <Button variant="link" className="p-0 h-auto font-normal flex gap-2 ">
                  {tx.hash}
                  <Copy className="h-3 w-3 text-gray-400" />
                </Button>
              </TableCell>
              <TableCell className="font-medium !py-0">
                <div className="py-1 px-2 bg-gray-50 border h-fit w-fit rounded-md">
                  {tx.method} 
                </div>
                </TableCell> 
              <TableCell className="font-medium !py-0">
                <Button variant="link" className="p-0 h-auto font-normal">
                  {tx.block}
                </Button>
              </TableCell>
              <TableCell className="font-medium !py-0 !px-2 !text-xs !w-full">{tx.age}</TableCell>
              <TableCell>
              <Button variant="link" className="p-0 h-auto font-normal flex gap-2 ">
                  {tx.from}
                  <Copy className="h-3 w-3 text-gray-400" />
                </Button>
              </TableCell>
              <TableCell className="font-medium !py-0">
              <Button variant="link" className="p-0 h-auto font-normal flex gap-2 ">
                  {tx.to}
                  <Copy className="h-3 w-3 text-gray-400" />
                </Button>
              </TableCell>
              <TableCell className="font-medium !py-0">{tx.value}</TableCell>
              <TableCell className="font-medium !py-0">{tx.txnFee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}