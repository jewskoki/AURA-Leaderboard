'use client'

import { useState, useRef, useEffect } from 'react'
import { Trade } from '@/lib/types'

interface Props {
  weekKey: string
  existingTraders: string[]
  onAdd: (trade: Trade) => Promise<void>
  onClose: () => void
}

export default function AddTradeModal({ weekKey, existingTraders, onAdd, onClose }: Props) {
  const [traderName, setTraderName] = useState('')
  const [rr, setRr] = useState('')
  const [outcome, setOutcome] = useState<'win' | 'loss'>('win')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const filtered = existingTraders.filter((t) =>
    t.toLowerCase().includes(traderName.toLowerCase()) && t !== traderName
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const rrVal = parseFloat(rr)
    if (!traderName.trim() || isNaN(rrVal) || rrVal <= 0) return
    setSubmitting(true)
    const trade: Trade = {
      id: crypto.randomUUID(),
      traderName: traderName.trim(),
      rr: rrVal,
      outcome,
      date: new Date().toISOString(),
      weekKey,
    }
    await onAdd(trade)
    setSubmitting(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-5">Ajouter un trade</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trader name */}
          <div className="relative">
            <label className="block text-xs text-zinc-400 mb-1.5">Trader</label>
            <input
              ref={inputRef}
              type="text"
              value={traderName}
              onChange={(e) => { setTraderName(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Nom du trader"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {showSuggestions && filtered.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden shadow-xl">
                {filtered.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => { setTraderName(name); setShowSuggestions(false) }}
                    className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RR */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">RR obtenu</label>
            <input
              type="number"
              value={rr}
              onChange={(e) => setRr(e.target.value)}
              placeholder="ex: 2.5"
              step="0.1"
              min="0.1"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Win / Loss */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Résultat</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOutcome('win')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  outcome === 'win'
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                Win
              </button>
              <button
                type="button"
                onClick={() => setOutcome('loss')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  outcome === 'loss'
                    ? 'bg-red-500/20 border border-red-500 text-red-400'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                Loss
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!traderName.trim() || !rr || submitting}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Envoi...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
