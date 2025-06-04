"use client"

import { BalanceCard } from "./balance-card"
import { InfoCard } from "./info-card"
import { MultichainCard } from "./multichain-card"

interface AddressOverviewProps {
  address: string
}

export function AddressOverview({ address }: AddressOverviewProps) {
  const mockData = {
    balance: {
      ucc: 0,
      value: 0.00,
      tokens: [
        {
          type: "UCC-20",
          name: "GOGAME",
          symbol: "GGO",
          amount: "200",
        },
        {
          type: "UCC-20",
          name: "S39 Token",
          symbol: "S39",
          amount: "200",
        },
        {
          type: "UCC-20",
          name: "ThankYou",
          symbol: "ThankY",
          amount: "90,000,000,000,000,000",
        },
        {
          type: "UCC-20",
          name: "TOKEN",
          symbol: "TOKEN",
          amount: "298,222.198686",
          suspicious: true
        }
      ]
    },
    info: {
      transactions: {
        latest: "421 days ago",
        first: "514 days ago"
      },
      fundedBy: {
        address: "UC4e5acf96..5fe33d23f",
        txn: "UC4e5acf96...5fe33d23f"
      }
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex gap-6 flex-col md:flex-row lg:gap-6 w-full lg:w-2/3">
        <BalanceCard balance={mockData.balance} />
        <InfoCard info={mockData.info} />
      </div>

      <div className="flex w-full lg:w-1/3">
        <MultichainCard />
      </div>


    </div>
  )
}