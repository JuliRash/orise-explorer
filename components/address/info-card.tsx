"use client"

import { Plus, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface InfoCardProps {
  info: {
    transactions: {
      latest: string
      first: string
    }
    fundedBy: {
      address: string
      txn: string
    }
  }
}

export function InfoCard({ info }: InfoCardProps) {
  return (
    <Card className="p-6 overflow-auto w-full">
      <h3 className="text-base font-semibold mb-6">More Info</h3>
      <div className="space-y-6">
        <div>
          <div className="text-sm text-muted-foreground opacity-50 flex items-center justify-between mb-2">
            PRIVATE NAME TAGS
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 text-xs border-dashed"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-muted-foreground opacity-50 mb-2">TRANSACTIONS SENT</div>
          <div className="space-y-1 flex gap-3">
            <div className="flex items-center gap-1 justify-between">
              <span className="text-sm opacity-50">Latest: </span>
              <div className="flex items-center gap-1">
                <span className="text-sm"> {info.transactions.latest}</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm opacity-50">First: </span>
              <div className="flex items-center gap-1">
                <span className="text-sm"> {info.transactions.first}</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-muted-foreground opacity-50 mb-2">FUNDED BY</div>
          <div className="flex items-center gap-2">
            <Link 
              href={`/address/${info.fundedBy.address}`}
              className="text-primary hover:text-primary/90 text-sm"
            >
              {info.fundedBy.address}
            </Link>
            <span className="text-muted-foreground opacity-50 text-sm">at txn</span>
            <Link 
              href={`/tx/${info.fundedBy.txn}`}
              className="text-primary hover:text-primary/90 text-sm"
            >
              {info.fundedBy.txn}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}