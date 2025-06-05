"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, FileText, ArrowRight } from "lucide-react";
import { fetchWithCors, REST_API_URL } from "@/lib/api-utils";
import Link from "next/link";

interface Transaction {
  hash: string;
  time: string;
  from: string;
  to: string;
  amount: string;
}

export function LatestTransactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["latestTransactions"],
    queryFn: async () => {
      const event = encodeURIComponent("tx.height>=1");
      const response = await fetchWithCors(`${REST_API_URL}/cosmos/tx/v1beta1/txs?events=${event}&order_by=ORDER_BY_DESC&limit=5`);
      const data = await response.json();

      if (!data.tx_responses) {
        return [];
      }

      return data.tx_responses.map((tx: any) => {
        let from = "", to = "", amount = "0 UCC";

        // Parse events to get the actual amount transferred
        if (tx.logs && tx.logs.length > 0) {
          const events = tx.logs[0].events;

          const coinSpentEvent = events.find((event: any) => event.type === "coin_spent");
          if (coinSpentEvent) {
            console.log(coinSpentEvent, 'powers');

            const amountAttr = coinSpentEvent.attributes.find((attr: any) => attr.key === "amount");
            if (amountAttr && amountAttr.value) {

              // Remove 'atucc' from the end and convert to UCC
              const rawAmount = amountAttr.value.replace('aoai', '');
              const value = (BigInt(rawAmount) * BigInt(100) / BigInt(10 ** 18)) / BigInt(100);
              amount = `${value.toString()} OAI`;
              console.log(amount, 'amount spent')
            }
          }
          // Get sender and receiver from message events
          const messageEvent = events.find((event: any) => event.type === "message");
          if (messageEvent) {
            console.log(messageEvent, 'oakakaka');
            const senderAttr = messageEvent.attributes.find((attr: any) => attr.key === "sender");
            const recipientAttr = [...events].reverse().find((event: any) => event.type === "coin_received")
              ?.attributes.find((attr: any) => attr.key === "receiver");

            if (senderAttr) from = senderAttr.value;
            if (recipientAttr) to = recipientAttr.value;

          }
          console.log("recipientAttr", to);
        }

        // Calculate time difference
        const txTime = new Date(tx.timestamp);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - txTime.getTime()) / 1000);
        let timeAgo;
        if (diffSeconds < 60) {
          timeAgo = `${diffSeconds} secs ago`;
        } else if (diffSeconds < 3600) {
          timeAgo = `${Math.floor(diffSeconds / 60)} mins ago`;
        } else if (diffSeconds < 86400) {
          timeAgo = `${Math.floor(diffSeconds / 3600)} hrs ago`;
        } else {
          timeAgo = `${Math.floor(diffSeconds / 86400)} days ago`;
        }

        console.log(amount)

        return {
          hash: tx.txhash,
          time: timeAgo,
          from,
          to,
          amount
        };
      });
    },
    refetchInterval: 5000,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });



  if (isLoading) {

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Latest Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  console.log(transactions, 'console transactions')

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Latest Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {transactions?.map((tx) => (
            <Link
              key={tx.hash}
              href={`/tx/${tx.hash}`}
              className="grid grid-cols-[200px_1fr_200px] items-start gap-4 hover:bg-muted p-2 rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <div className="font-mono text-sm text-blue-500">
                    {tx.hash.slice(0, 10)}...
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tx.time}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[50px_1fr] items-center text-sm">
                  <span className="text-muted-foreground">From</span>
                  <span className="font-mono text-blue-500">{tx.from.slice(0, 8)}...{tx.from.slice(-8)}</span>
                </div>
                <div className="grid grid-cols-[50px_1fr] items-center text-sm">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-mono text-blue-500">{tx.to.slice(0, 8)}...{tx.to.slice(-8)}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium">
                  {tx.amount}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/transactions"
          className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          VIEW ALL TRANSACTIONS
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}