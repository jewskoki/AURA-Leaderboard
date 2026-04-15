'use client'

const rules = [
  {
    number: '01',
    title: 'No Gambling',
    description: 'Only trades based on technical or fundamental analysis are accepted. Random entries will be disqualified.',
    icon: '🎰',
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'from-red-500/10 to-red-600/5',
  },
  {
    number: '02',
    title: 'Real Account Only',
    description: 'Demo account trades are strictly not accepted. Your trade must be taken on a live funded account.',
    icon: '💳',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'from-blue-500/10 to-blue-600/5',
  },
  {
    number: '03',
    title: 'Proof Required',
    description: 'Submit a before & after screenshot or video showing the trade entry and result. Final result only will not be accepted.',
    icon: '📸',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'from-emerald-500/10 to-emerald-600/5',
  },
]

export default function RulesPanel() {
  return (
    <div className="w-full lg:w-56 flex-shrink-0">
      <div className="sticky top-10">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Competition</p>
          <h2 className="text-base font-bold text-white">Rules</h2>
        </div>

        <div className="space-y-3">
          {rules.map((r) => (
            <div
              key={r.number}
              className={`relative rounded-2xl border bg-gradient-to-br ${r.bg} ${r.border} p-4 backdrop-blur-md overflow-hidden`}
            >
              {/* Subtle bg number */}
              <span className="absolute -right-1 -bottom-2 text-5xl font-black opacity-[0.06] select-none">
                {r.number}
              </span>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base leading-none">{r.icon}</span>
                  <p className={`text-xs font-bold uppercase tracking-wide ${r.color}`}>
                    {r.title}
                  </p>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-zinc-700 mt-4 text-center">
          Breaking rules = disqualification
        </p>
      </div>
    </div>
  )
}
