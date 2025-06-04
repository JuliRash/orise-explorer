"use client"

import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddressHeaderProps {
  address: string
}

export function AddressHeader({ address }: AddressHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full" />
        <h1 className="text-xl font-semibold">Address</h1>
        <span className="text-muted-foreground">{address}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}