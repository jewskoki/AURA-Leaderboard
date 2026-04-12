'use client'

import { ChevronLeftIcon, ChevronRightIcon } from './Icons'
import { getWeekBounds, navigateWeek } from '@/lib/rankings'

interface Props {
  weekKey: string
  onChange: (weekKey: string) => void
}

function formatWeekLabel(weekKey: string): string {
  const { start, end } = getWeekBounds(weekKey)
  const fmt = (d: Date) =>
    d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return `${fmt(start)} — ${fmt(end)} ${end.getFullYear()}`
}

export default function WeekSelector({ weekKey, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(navigateWeek(weekKey, 'prev'))}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <ChevronLeftIcon />
      </button>
      <span className="text-sm font-medium text-zinc-300 min-w-[200px] text-center">
        {formatWeekLabel(weekKey)}
      </span>
      <button
        onClick={() => onChange(navigateWeek(weekKey, 'next'))}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}
