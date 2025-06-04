export interface TransactionType {
    hash: string
    method: string
    block: string
    timestamp: string
    from: string
    to: string
    value: string
    fee: string
    direction?: "IN" | "OUT"
  }