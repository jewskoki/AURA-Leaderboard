'use client'

import { AnimatePresence } from 'framer-motion'
import { TraderStats } from '@/lib/types'
import TraderCard from './TraderCard'

interface Props {
  stats: TraderStats[]
  onDeleteTrade: (id: string) => void
}

export default function Leaderboard({ stats, onDeleteTrade }: Props) {
  if (stats.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-600">
        <p className="text-4xl mb-3">📉</p>
        <p className="text-sm">Aucun trade cette semaine.</p>
        <p className="text-xs mt-1">Ajoute des trades pour voir le classement.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <AnimatePresence mode="popLayout">
        {stats.map((trader, i) => (
          <TraderCard
            key={trader.name}
            stats={trader}
            rank={i + 1}
            onDeleteTrade={onDeleteTrade}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
