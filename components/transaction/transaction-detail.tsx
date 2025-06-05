"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import { Loader2, ArrowRight, Clock, Cpu, Fuel, Wallet } from "lucide-react"
import { fetchWithCors, REST_API_URL } from "@/lib/api-utils"
import Link from "next/link"

interface Transaction {
  hash: string
  height: number
  status: string
  time: string
  gasUsed: string
  gasWanted: string
  fee: string
  memo: string
  to: string
  events: Array<{
    type: string
    attributes: Array<{
      key: string
      value: string
    }>
  }>
}

export function TransactionDetail({ hash }: { hash: string }) {
  const { data: transaction, isLoading } = useQuery<Transaction>({
    queryKey: ["transaction", hash],
    queryFn: async () => {
      const response = await fetchWithCors(`${REST_API_URL}/cosmos/tx/v1beta1/txs/${hash}`);
      
      if (!response.ok) {
        throw new Error('Transaction not found');
      }
      
      const data = await response.json();
      
      if (!data.tx_response) {
        throw new Error('Transaction not found');
      }
      
      const txResponse = data.tx_response;
      const tx = data.tx;
      
      // Extract fee information
      let fee = "0 UCC";
      if (tx?.auth_info?.fee?.amount && tx.auth_info.fee.amount.length > 0) {
        const feeAmount = tx.auth_info.fee.amount[0];
        fee = `${parseInt(feeAmount.amount) / Math.pow(10, 18)} ${feeAmount.denom.replace('a', '')}`;
      }
      
      // Extract memo if present
      const memo = tx?.body?.memo || "";
      const extractedTo = tx?.body?.messages?.[0]?.data?.to || "";
      
      // Transform events
      const parsedEvents = txResponse.events.map((event: any) => {
        return {
          type: event.type,
          attributes: event.attributes.map((attr: any) => {
            try {
              const key = attr.key.includes('=') ? atob(attr.key) : attr.key;
              const value = attr.value ? (attr.value.includes('=') ? atob(attr.value) : attr.value) : "";
              return { key, value };
            } catch {
              return {
                key: attr.key,
                value: attr.value || ""
              };
            }
          })
        };
      });
      
      return {
        hash: txResponse.txhash,
        height: parseInt(txResponse.height),
        status: txResponse.code === 0 ? "Success" : "Failed",
        time: txResponse.timestamp,
        gasUsed: txResponse.gas_used,
        gasWanted: txResponse.gas_wanted,
        fee: fee,
        memo: memo,
        to: extractedTo,
        events: parsedEvents
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">Transaction Not Found</h3>
            <p className="text-muted-foreground">
              Could not find transaction with hash {hash}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find transfer event details
  const transferEvent = [...transaction.events].reverse().find(event => event.type === 'transfer');
  const transferDetails = transferEvent?.attributes.reduce((acc: any, attr) => {
    if (attr.key === 'sender') acc.from = attr.value;
    if (attr.key === 'recipient') acc.to = attr.value;
    if (attr.key === 'amount'){
      const rawAmount = attr.value.replace('aoai', '');
      console.log(rawAmount,'aaaaa');
      let convertedAmount = (BigInt(rawAmount) * BigInt(100) / BigInt(10 ** 18)) / BigInt(100)
      acc.amount = `${convertedAmount.toString()} OAI`;
    } 
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Transaction Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Transaction Summary</span>
            <span className={`text-sm px-2 py-1 rounded ${
              transaction.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {transaction.status}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Transaction Hash */}
            <div>
              <div className="text-sm text-muted-foreground mb-1">Transaction Hash</div>
              <div className="font-mono text-sm break-all bg-muted p-2 rounded">{transaction.hash}</div>
            </div>

            {/* Transfer Details */}
            {transferDetails && (
              <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Transfer Details</span>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">From:</span>
                    <Link href={`/address/${transferDetails.from}`} className="text-sm font-mono hover:underline">
                      {transferDetails.from}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">To:</span>
                    <Link href={`/address/${transferDetails.to}`} className="text-sm font-mono hover:underline">
                      {transferDetails.to}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="text-sm font-medium">{transferDetails.amount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Time and Block Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Time</span>
                </div>
                <div className="text-sm">{new Date(transaction.time).toLocaleString()}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Block</span>
                </div>
                <Link href={`/block/${transaction.height}`} className="text-sm hover:underline">
                  {transaction.height}
                </Link>
              </div>
            </div>

            {/* Gas and Fee Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Gas</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Used:</span>
                    <span className="text-sm">{transaction.gasUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Limit:</span>
                    <span className="text-sm">{transaction.gasWanted}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Transaction Fee</span>
                </div>
                <div className="text-sm">{transaction.fee}</div>
              </div>
            </div>

            {/* Memo */}
            {transaction.memo && (
              <>
                <Separator className="my-4" />
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Memo</div>
                  <div className="bg-muted p-2 rounded-md text-sm">{transaction.memo}</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Events Card */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transaction.events.map((event, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="font-medium mb-2">Event Type: {event.type}</div>
                <div className="bg-muted rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Key</th>
                        <th className="text-left p-2 font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.attributes.map((attr, attrIndex) => (
                        <tr key={attrIndex} className="border-b last:border-0">
                          <td className="p-2 font-mono">{attr.key}</td>
                          <td className="p-2 font-mono break-all">{attr.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
} 