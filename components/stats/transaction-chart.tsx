"use client"

import { format } from "date-fns"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { useQuery } from "@tanstack/react-query"

interface TransactionChartProps {
  data?: Array<{
    date: Date
    value: number
  }>
}

interface BlockData {
  height: number;
  time: string;
  txCount: number;
}

export function TransactionChart({ data: initialData }: TransactionChartProps) {
  const { data: chartData } = useQuery({
    queryKey: ["transaction-history"],
    queryFn: async () => {
      // Get current block height
      const statusResponse = await fetch('http://145.223.80.193:26657/status');
      const statusData = await statusResponse.json();
      const latestHeight = parseInt(statusData.result.sync_info.latest_block_height);
      
      // Calculate sample points for 14 days
      const days = 14;
      const samplesPerDay = 4; // 4 samples per day
      const totalSamples = days * samplesPerDay;
      const blockInterval = Math.floor((24 * 60 * 60) / (3 * samplesPerDay)); // blocks between samples (3s block time)
      
      // Collect block data
      const blockPromises: Promise<BlockData>[] = [];
      for (let i = 0; i < totalSamples; i++) {
        const targetHeight = latestHeight - (blockInterval * i);
        blockPromises.push(
          fetch(`http://145.223.80.193:26657/block?height=${targetHeight}`)
            .then(res => res.json())
            .then(data => ({
              height: targetHeight,
              time: data.result.block.header.time,
              txCount: data.result.block.data.txs ? data.result.block.data.txs.length : 0
            }))
        );
      }

      // Get all block data in parallel
      const blocks = await Promise.all(blockPromises);
      
      // Group by day and calculate daily stats
      const dailyStats = blocks.reduce((acc: Map<string, number[]>, block) => {
        const day = format(new Date(block.time), "yyyy-MM-dd");
        if (!acc.has(day)) {
          acc.set(day, []);
        }
        acc.get(day)?.push(block.txCount);
        return acc;
      }, new Map());

      // Calculate daily averages and format for chart
      const chartPoints = Array.from(dailyStats.entries()).map(([day, counts]) => ({
        date: new Date(day),
        value: Math.round(counts.reduce((sum: number, count: number) => sum + count, 0) / counts.length)
      }));

      return chartPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });

  const data = chartData || initialData || [];
  const maxValue = Math.max(...data.map(d => d.value));
  const yAxisTicks = [0, Math.round(maxValue / 2), maxValue];

  return (
    <div className="bg-card p-4 h-fit rounded-lg">
      <div className="text-sm text-muted-foreground opacity-50 mb-4">
        UCC SMART CHAIN TRANSACTION HISTORY IN 14 DAYS
      </div>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} />
            <XAxis 
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "MMM dd")}
              stroke="#888888"
              fontSize={12}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickFormatter={(value) => `${value}`}
              ticks={yAxisTicks}
              domain={[0, maxValue]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card p-2 border rounded-lg shadow-sm">
                      <div className="text-sm">
                        {format(new Date(payload[0].payload.date), "MMM dd, yyyy")}
                      </div>
                      <div className="font-semibold">
                        {payload[0].value} transactions
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}