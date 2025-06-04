"use client"

import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

export function TransferVolume() {
  const { data: volumeData } = useQuery({
    queryKey: ["transfer-volume"],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return Array(14).fill(null).map((_, i) => ({
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000),
        volume: Math.random() * 1000000000
      }))
    }
  })

  const formattedData = volumeData?.map(item => ({
    date: format(item.date, "MM/dd"),
    volume: item.volume
  }))

  return (
    <Card className="p-6">
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`}
            />
            <Tooltip
              formatter={(value: number) => [`$${(value / 1e9).toFixed(2)}B`, "Volume"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="volume" 
              stroke="var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}