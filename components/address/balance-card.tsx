"use client"

import { useState } from "react"
import { ChevronDown, CreditCard, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface Token {
  type: string
  name: string
  symbol: string
  amount: string
  suspicious?: boolean
}

interface BalanceCardProps {
  balance: {
    ucc: number
    value: number
    tokens: Token[]
  }
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTokens = balance.tokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="p-6 w-full">
      <h6 className="text-base font-semibold mb-6">Overview</h6>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-gray-500 mb-2">UCC BALANCE</div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/icon.png"
              alt="UCC"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-lg mr-1">{balance.ucc} UCC</span>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-2 ">UCC VALUE</div>
          <div className="text-lg">${balance.value.toFixed(2)}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-2">TOKEN HOLDINGS</div>
          <div className="relative">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                className="w-full justify-between h-auto py-2 px-4"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>${balance.value.toFixed(2)} ({balance.tokens.length} Tokens)</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform ",
                  isDropdownOpen && "transform rotate-180"
                )} />
              </Button>
              <div className= "p-2 rounded bg-border">
              <Wallet className="h-4 w-4 rounded bg-borderx text-black cursor-pointer hover:text-foreground" />
              </div>
            
              
            </div>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border shadow-lg z-50">
                <div className="p-4">
                  <Input
                    placeholder="Search for Token Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4"
                  />

                  <div className="font-medium mb-2">UCC-20 Tokens ({balance.tokens.length})</div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {filteredTokens.map((token, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={``}
                            alt={''}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <span>{token.type}: {token.name}</span>
                              {token.suspicious && (
                                <span className="text-xs text-red-500">[Suspicious]</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{token.amount} {token.symbol}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    asChild
                  >
                    <Link href="/#" className="flex items-center justify-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      VIEW ALL HOLDINGS
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}