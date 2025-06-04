"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { User, Clock } from "lucide-react";
import { fetchWithCors, REST_API_URL, RPC_API_URL } from "@/lib/api-utils";

interface Block {
  height: string;
  validator: string;
  txns: number;
  time: string;
}

export function LatestBlocks() {
  const { data: blocks, isLoading } = useQuery<Block[]>({
    queryKey: ["latest-blocks"],
    queryFn: async () => {
      // Fetch latest block info from the endpoint
      const response = await fetchWithCors(`${RPC_API_URL}/status`);
      const data = await response.json();
      
      const latestHeight = parseInt(data.result.sync_info.latest_block_height);
      const blockPromises = [];
      
      // Fetch last 5 blocks
      for (let i = 0; i < 5; i++) {
        const height = latestHeight - i;
        const promise = fetchWithCors(`${RPC_API_URL}/block?height=${height}`)
          .then(res => res.json())
          .then(blockData => {
            const blockTime = new Date(blockData.result.block.header.time);
            const now = new Date();
            const timeAgo = Math.floor((now.getTime() - blockTime.getTime()) / 1000);
            let timeString;
            if (timeAgo < 60) {
              timeString = `${timeAgo} secs ago`;
            } else if (timeAgo < 3600) {
              const mins = Math.floor(timeAgo / 60);
              timeString = `${mins} min${mins > 1 ? 's' : ''} ago`;
            } else {
              const hours = Math.floor(timeAgo / 3600);
              timeString = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            }
            
            return {
              height: height.toString(),
              validator: blockData.result.block.header.proposer_address,
              txns: blockData.result.block.data.txs ? blockData.result.block.data.txs.length : 0,
              time: timeString,
            };
          });
        blockPromises.push(promise);
      }
      
      return Promise.all(blockPromises);
    },
    refetchInterval: 1000, // Refetch every second for more real-time updates
    staleTime: 0, // Consider data stale immediately to ensure fresh data
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-col space-y-2 pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-2xl font-bold">Latest Blocks</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 pb-4 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <CardTitle className="text-2xl font-bold">Latest Blocks</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blocks?.map((block, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-3 border-b last:border-0"
            >
              {/* Block Details */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="rounded-md bg-background p-2">
                  <Box className="h-6 w-6 text-muted" />
                </div>
                <div>
                  <Link
                    href={`/block/${block.height}`}
                    className="text-primary hover:text-blue-600 font-medium"
                  >
                    {block.height}
                  </Link>
                  <div className="text-sm text-muted-foreground opacity-50">
                    {block.time}
                  </div>
                </div>
              </div>

              {/* Validator and Transactions */}
              <div className="text-sm w-full text-muted-foreground w-full md:w-auto">
                <div>
                  <span className="opacity-50">Validated By </span>
                  <Link
                    href={`/address/${block.validator}`}
                    className="text-primary hover:text-blue-600 break-all"
                  >
                    {block.validator}
                  </Link>
                </div>
                <div>
                  <span className="text-primary">{block.txns} </span>
                  <span className="opacity-50">txns in 3 secs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Link 
          href="/blocks" 
          className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          VIEW ALL BLOCKS
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}