"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { fetchWithCors, REST_API_URL } from "@/lib/api-utils"

interface Validator {
  operatorAddress: string
  consensusPubkey: {
    type: string
    key: string
  }
  jailed: boolean
  status: string
  tokens: string
  delegatorShares: string
  description: {
    moniker: string
    identity: string
    website: string
    securityContact: string
    details: string
  }
  commission: {
    commissionRates: {
      rate: string
      maxRate: string
      maxChangeRate: string
    }
    updateTime: string
  }
}

export function ValidatorStats() {
  const { data: validators, isLoading } = useQuery<Validator[]>({
    queryKey: ["validatorStats"],
    queryFn: async () => {
      const response = await fetchWithCors(`${REST_API_URL}/cosmos/staking/v1beta1/validators`)
      const data = await response.json()
      
      return data.validators.map((validator: any) => ({
        operatorAddress: validator.operator_address,
        consensusPubkey: {
          type: validator.consensus_pubkey["@type"],
          key: validator.consensus_pubkey.key
        },
        jailed: validator.jailed,
        status: validator.status.replace("BOND_STATUS_", ""),
        tokens: (parseInt(validator.tokens) / Math.pow(10, 18)).toLocaleString(), // Convert to UCC
        delegatorShares: (parseFloat(validator.delegator_shares) / Math.pow(10, 18)).toLocaleString(), // Convert to shares
        description: {
          moniker: validator.description.moniker,
          identity: validator.description.identity,
          website: validator.description.website,
          securityContact: validator.description.security_contact,
          details: validator.description.details
        },
        commission: {
          commissionRates: {
            rate: (parseFloat(validator.commission.commission_rates.rate) * 100).toFixed(2) + "%",
            maxRate: (parseFloat(validator.commission.commission_rates.max_rate) * 100).toFixed(2) + "%",
            maxChangeRate: (parseFloat(validator.commission.commission_rates.max_change_rate) * 100).toFixed(2) + "%"
          },
          updateTime: new Date(validator.commission.update_time).toLocaleString()
        }
      }))
    },
    refetchInterval: 5000,
    staleTime: 0,
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Validators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validators</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Moniker</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Voting Power</TableHead>
              <TableHead>Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validators?.map((validator) => (
              <TableRow key={validator.operatorAddress}>
                <TableCell className="font-medium">{validator.description.moniker}</TableCell>
                <TableCell>
                  <Badge variant={validator.status === "BONDED" ? "default" : validator.jailed ? "destructive" : "secondary"}>
                    {validator.status}
                  </Badge>
                </TableCell>
                <TableCell>{validator.tokens} UCC</TableCell>
                <TableCell>{validator.commission.commissionRates.rate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 