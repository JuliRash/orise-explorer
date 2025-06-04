"use client"

import { LatestBlocks } from "./latest-blocks"
import { LatestTransactions } from "./latest-transactions"

export function LatestActivity() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 px-4">
      <LatestBlocks />
      <LatestTransactions />
    </div>
  )
}