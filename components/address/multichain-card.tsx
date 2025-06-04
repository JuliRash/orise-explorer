"use client"

import { Card } from "@/components/ui/card"

export function MultichainCard() {
  return (
    <Card className="p-6 w-full">
      <h3 className="text-base font-semibold mb-6">Multichain Info</h3>
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">$0</span>
          <span className="text-sm text-muted-foreground">(Multichain Portfolio)</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">No addresses found</p>
        <div className="bg-input rounded-lg h-32 flex items-center justify-center text-muted-foreground">
          Ads
        </div>
      </div>
    </Card>
  )
}