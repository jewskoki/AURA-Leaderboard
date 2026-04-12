import { Trade, TraderStats } from './types'

export function getWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  // ISO week: Monday-based
  const day = d.getDay() === 0 ? 7 : d.getDay()
  d.setDate(d.getDate() + 4 - day)
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

export function getWeekBounds(weekKey: string): { start: Date; end: Date } {
  const [year, week] = weekKey.split('-W').map(Number)
  const jan1 = new Date(year, 0, 1)
  const daysToMonday = (8 - (jan1.getDay() === 0 ? 7 : jan1.getDay())) % 7
  const firstMonday = new Date(jan1)
  firstMonday.setDate(jan1.getDate() + daysToMonday)
  const start = new Date(firstMonday)
  start.setDate(firstMonday.getDate() + (week - 1) * 7)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return { start, end }
}

export function computeStats(trades: Trade[], weekKey: string): TraderStats[] {
  const weekTrades = trades.filter((t) => t.weekKey === weekKey)

  const grouped: Record<string, Trade[]> = {}
  for (const trade of weekTrades) {
    if (!grouped[trade.traderName]) grouped[trade.traderName] = []
    grouped[trade.traderName].push(trade)
  }

  const stats: TraderStats[] = Object.entries(grouped).map(([name, traderTrades]) => {
    const wins = traderTrades.filter((t) => t.outcome === 'win')
    const avgWinRR = wins.length > 0 ? wins.reduce((sum, t) => sum + t.rr, 0) / wins.length : 0
    const bestRR = traderTrades.length > 0 ? Math.max(...traderTrades.map((t) => t.rr)) : 0
    return {
      name,
      trades: traderTrades,
      avgWinRR,
      bestRR,
      winCount: wins.length,
      totalTrades: traderTrades.length,
    }
  })

  return stats.sort((a, b) => b.bestRR - a.bestRR)
}

export function navigateWeek(weekKey: string, direction: 'prev' | 'next'): string {
  const [year, week] = weekKey.split('-W').map(Number)
  const totalWeeks = 52
  if (direction === 'next') {
    if (week >= totalWeeks) return `${year + 1}-W01`
    return `${year}-W${String(week + 1).padStart(2, '0')}`
  } else {
    if (week <= 1) return `${year - 1}-W52`
    return `${year}-W${String(week - 1).padStart(2, '0')}`
  }
}
