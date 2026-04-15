'use client'

const prizes = [
  {
    rank: 1,
    emoji: '🥇',
    label: '1st Place',
    prize: 'Funded Lucid',
    detail: '$50,000',
    color: 'from-yellow-500/20 to-yellow-600/5',
    border: 'border-yellow-400/30',
    glow: 'shadow-[0_0_24px_rgba(234,179,8,0.12)]',
    textColor: 'text-yellow-400',
    detailColor: 'text-yellow-300',
  },
  {
    rank: 2,
    emoji: '🥈',
    label: '2nd Place',
    prize: '1-on-1 Coaching',
    detail: '1h with Trikoos',
    color: 'from-zinc-400/15 to-zinc-500/5',
    border: 'border-zinc-400/25',
    glow: 'shadow-[0_0_20px_rgba(161,161,170,0.08)]',
    textColor: 'text-zinc-300',
    detailColor: 'text-zinc-400',
  },
  {
    rank: 3,
    emoji: '🥉',
    label: '3rd Place',
    prize: 'Free Entry',
    detail: 'Next contest',
    color: 'from-amber-600/15 to-amber-700/5',
    border: 'border-amber-600/25',
    glow: 'shadow-[0_0_20px_rgba(180,83,9,0.1)]',
    textColor: 'text-amber-500',
    detailColor: 'text-amber-600',
  },
]

export default function PrizesPanel() {
  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-10">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Weekly Prizes</p>
          <h2 className="text-base font-bold text-white">Rewards</h2>
        </div>

        <div className="space-y-3">
          {prizes.map((p) => (
            <div
              key={p.rank}
              className={`relative rounded-2xl border bg-gradient-to-br ${p.color} ${p.border} ${p.glow} p-4 backdrop-blur-md overflow-hidden`}
            >
              {/* Subtle bg number */}
              <span className="absolute -right-2 -bottom-3 text-6xl font-black opacity-[0.06] select-none">
                {p.rank}
              </span>

              <div className="flex items-start gap-3 relative z-10">
                <span className="text-2xl leading-none mt-0.5">{p.emoji}</span>
                <div className="min-w-0">
                  <p className={`text-[10px] uppercase tracking-widest font-semibold ${p.textColor} mb-0.5`}>
                    {p.label}
                  </p>
                  <p className="text-white font-bold text-sm leading-tight">{p.prize}</p>
                  <p className={`text-xs mt-0.5 font-medium ${p.detailColor}`}>{p.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-[10px] text-zinc-700 mt-4 text-center">
          Prizes awarded every Monday
        </p>
      </div>
    </div>
  )
}
