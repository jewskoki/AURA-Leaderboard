import { supabase } from './supabase'
import { Trade } from './types'

export async function loadTrades(): Promise<Trade[]> {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('loadTrades error:', error)
    return []
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    traderName: row.trader_name,
    rr: Number(row.rr),
    outcome: row.outcome as 'win' | 'loss',
    date: row.date,
    weekKey: row.week_key,
  }))
}

export async function addTrade(trade: Trade): Promise<void> {
  const { error } = await supabase.from('trades').insert({
    id: trade.id,
    trader_name: trade.traderName,
    rr: trade.rr,
    outcome: trade.outcome,
    date: trade.date,
    week_key: trade.weekKey,
  })
  if (error) console.error('addTrade error:', error)
}

export async function deleteTrade(id: string): Promise<void> {
  const { error } = await supabase.from('trades').delete().eq('id', id)
  if (error) console.error('deleteTrade error:', error)
}
