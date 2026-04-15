'use client'

import { useState, useEffect, useCallback } from 'react'
import { Trade } from '@/lib/types'
import { loadTrades, addTrade, deleteTrade } from '@/lib/storage'
import { computeStats, getWeekKey } from '@/lib/rankings'
import WeekSelector from '@/components/WeekSelector'
import Leaderboard from '@/components/Leaderboard'
import AddTradeModal from '@/components/AddTradeModal'
import PrizesPanel from '@/components/PrizesPanel'
import RulesPanel from '@/components/RulesPanel'
import { PlusIcon } from '@/components/Icons'

const ADMIN_PASSWORD = 'Baptiste2005?'

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [weekKey, setWeekKey] = useState<string>(() => getWeekKey(new Date()))
  const [showModal, setShowModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTrades = useCallback(async () => {
    setLoading(true)
    const data = await loadTrades()
    setTrades(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTrades()
  }, [fetchTrades])

  const handleAdd = useCallback(async (trade: Trade) => {
    await addTrade(trade)
    await fetchTrades()
  }, [fetchTrades])

  const handleDelete = useCallback(async (id: string) => {
    await deleteTrade(id)
    await fetchTrades()
  }, [fetchTrades])

  function handleAdminClick() {
    if (isAdmin) {
      setShowModal(true)
    } else {
      setShowPasswordPrompt(true)
      setPasswordInput('')
      setPasswordError(false)
    }
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setShowPasswordPrompt(false)
      setShowModal(true)
    } else {
      setPasswordError(true)
    }
  }

  const stats = computeStats(trades, weekKey)
  const allTraderNames = [...new Set(trades.map((t) => t.traderName))]

  return (
    <main className="relative min-h-screen bg-[#08080f] text-white overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-700/8 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #a78bfa 1px, transparent 1px),
              linear-gradient(to bottom, #a78bfa 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs text-violet-300 font-medium tracking-widest uppercase">Live</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
            AURA
          </h1>
          <p className="text-sm text-zinc-500 mt-1 tracking-widest uppercase">Leaderboard</p>
        </div>

        {/* Three-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left — rules */}
          <RulesPanel />

          {/* Center — leaderboard */}
          <div className="flex-1 min-w-0">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <WeekSelector weekKey={weekKey} onChange={setWeekKey} />
              <button
                onClick={handleAdminClick}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-900/40 cursor-pointer"
              >
                <PlusIcon />
                Ajouter un trade
              </button>
            </div>

            {/* Column header */}
            {stats.length > 0 && (
              <div className="flex items-center px-5 mb-2 text-[10px] uppercase tracking-widest text-zinc-700">
                <div className="w-10 flex-shrink-0 mr-4" />
                <div className="flex-1">Trader</div>
                <div className="pr-8 text-right">Best RR</div>
              </div>
            )}

            {/* Leaderboard */}
            {loading ? (
              <div className="text-center py-20 text-zinc-600 text-sm">Chargement...</div>
            ) : (
              <Leaderboard stats={stats} onDeleteTrade={isAdmin ? handleDelete : async () => {}} />
            )}
          </div>

          {/* Right — prizes */}
          <PrizesPanel />
        </div>
      </div>

      {/* Password prompt */}
      {showPasswordPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPasswordPrompt(false) }}
        >
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-1">Accès admin</h2>
            <p className="text-sm text-zinc-500 mb-5">Entre le mot de passe pour ajouter des trades.</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false) }}
                placeholder="Mot de passe"
                autoFocus
                className={`w-full bg-zinc-800 border rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none transition-colors ${
                  passwordError ? 'border-red-500' : 'border-zinc-700 focus:border-violet-500'
                }`}
              />
              {passwordError && <p className="text-red-400 text-xs">Mot de passe incorrect.</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordPrompt(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add trade modal */}
      {showModal && isAdmin && (
        <AddTradeModal
          weekKey={weekKey}
          existingTraders={allTraderNames}
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  )
}
