"use client"

import { Shield, Clock, ArrowLeftRight, Coins } from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface StatsGridProps {
  stats: {
    transactions: number
    tps: number
    gasPrice: number
    gasPriceUsd: number
    latestBlock: number
    blockTime: number
    votingPower: number
    validatorInfo: {
      commissionRate: number
      bondedStatus: string
      moniker: string
      delegatorShares: number
    }
  }
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Validator Status Card */}
      <div className="bg-card rounded-lg p-4 border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">VALIDATOR STATUS</span>
        </div>
        <div className="space-y-2">
          <div className="flex flex-col">
            <span className="text-lg font-medium">{stats.validatorInfo.moniker}</span>
            <span className="text-sm text-muted-foreground">
              {stats.validatorInfo.bondedStatus.replace('BOND_STATUS_', '')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Commission Rate</span>
            <span className="font-medium">{stats.validatorInfo.commissionRate}%</span>
          </div>
        </div>
      </div>

      {/* Network Stats Card */}
      <div className="bg-card rounded-lg p-4 border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">NETWORK STATS</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Latest Block</span>
            <div className="text-right">
              <span className="text-lg font-medium">{formatNumber(stats.latestBlock)}</span>
              <span className="text-sm text-muted-foreground ml-1">({stats.blockTime}s)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gas Price</span>
            <div className="text-right">
              <span className="text-lg font-medium">{stats.gasPrice} Gwei</span>
              <span className="text-sm text-muted-foreground ml-1">(${stats.gasPriceUsd})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Stats Card */}
      <div className="bg-card rounded-lg p-4 border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">TRANSACTION STATS</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Transactions</span>
            <span className="text-lg font-medium">{formatNumber(stats.transactions)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">TPS</span>
            <span className="text-lg font-medium">{stats.tps.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Voting Power</span>
            <div className="text-right">
              <span className="text-lg font-medium">{formatNumber(stats.votingPower)} UCC</span>
              <div className="text-xs text-muted-foreground">
                {formatNumber(stats.validatorInfo.delegatorShares)} shares
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}