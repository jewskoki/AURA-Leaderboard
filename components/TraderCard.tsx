'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TraderStats, Trade } from '@/lib/types'
import { TrashIcon } from './Icons'

interface Props {
  stats: TraderStats
  rank: number
  onDeleteTrade: (id: string) => void
}

const RANK_GLOW: Record<number, string> = {
  1: 'shadow-[0_0_20px_rgba(250,204,21,0.15)] border-yellow-400/30',
  2: 'shadow-[0_0_20px_rgba(161,161,170,0.1)] border-zinc-400/20',
  3: 'shadow-[0_0_20px_rgba(180,83,9,0.12)] border-amber-600/25',
}

const RANK_BADGE: Record<number, string> = {
  1: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/40',
  2: 'text-zinc-300 bg-zinc-300/10 border-zinc-400/30',
  3: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
}

const RANK_EMOJI: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function TraderCard({ stats, rank, onDeleteTrade }: Props) {
  const [expanded, setExpanded] = useState(false)
  const glowStyle = RANK_GLOW[rank] || 'border-white/[0.06]'
  const badgeStyle = RANK_BADGE[rank] || 'text-zinc-600 bg-zinc-600/10 border-zinc-600/20'
  const winRate = stats.totalTrades > 0 ? Math.round((stats.winCount / stats.totalTrades) * 100) : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className={`backdrop-blur-md bg-white/[0.04] border rounded-2xl overflow-hidden ${glowStyle}`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
      >
        {/* Rank badge */}
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold flex-shrink-0 ${badgeStyle}`}>
          {RANK_EMOJI[rank] ?? <span className="text-xs">{rank}</span>}
        </div>

        {/* Name + stats */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{stats.name}</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {stats.winCount}W / {stats.totalTrades - stats.winCount}L
            <span className="mx-1.5 text-zinc-700">·</span>
            {winRate}% win rate
          </p>
        </div>

        {/* Best RR */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-lg font-bold text-violet-400 leading-none">
              {stats.bestRR > 0 ? `${stats.bestRR.toFixed(2)}R` : '—'}
            </p>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Best RR</p>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-zinc-600 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded trade list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-5 py-3 space-y-2">
              {stats.trades.map((trade) => (
                <TradeRow key={trade.id} trade={trade} onDelete={onDeleteTrade} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TradeRow({ trade, onDelete }: { trade: Trade; onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${trade.outcome === 'win' ? 'bg-emerald-400' : 'bg-red-400'}`} />
        <span className={`text-xs font-medium ${trade.outcome === 'win' ? 'text-emerald-400' : 'text-red-400'}`}>
          {trade.outcome === 'win' ? 'Win' : 'Loss'}
        </span>
        <span className="text-white font-semibold">{trade.rr.toFixed(2)}R</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-zinc-600 text-xs">
          {new Date(trade.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(trade.id) }}
          className="text-zinc-700 hover:text-red-400 transition-colors p-1"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}
