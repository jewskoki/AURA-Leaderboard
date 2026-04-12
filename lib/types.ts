export interface Trade {
  id: string
  traderName: string
  rr: number
  outcome: 'win' | 'loss'
  date: string
  weekKey: string
}

export interface TraderStats {
  name: string
  trades: Trade[]
  avgWinRR: number
  bestRR: number
  winCount: number
  totalTrades: number
}

