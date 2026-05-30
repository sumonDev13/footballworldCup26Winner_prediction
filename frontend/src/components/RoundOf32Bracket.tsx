'use client'

import { Matchup } from '@/types'

interface RoundOf32BracketProps {
  matches: Matchup[]
  onPickWinner: (matchId: string, winnerId: 'home' | 'away') => void
}

const PAIRINGS: [number, number, string][] = [
  [1, 4, 'R16-1'],
  [0, 2, 'R16-2'],
  [3, 5, 'R16-3'],
  [6, 7, 'R16-4'],
  [10, 11, 'R16-5'],
  [8, 9, 'R16-6'],
  [13, 15, 'R16-7'],
  [12, 14, 'R16-8'],
]

function TeamBtn({
  team,
  label,
  side,
  isWinner,
  onPick,
}: {
  team: { name: string; flag: string } | null
  label: string
  side: 'home' | 'away'
  isWinner: boolean
  onPick: () => void
}) {
  return (
    <button
      onClick={onPick}
      disabled={!team}
      className={`
        flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all w-full text-left
        ${!team
          ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
          : isWinner
            ? 'bg-emerald-700/40 text-emerald-200 ring-1 ring-emerald-500/50'
            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:border-emerald-500/30'
        }
      `}
    >
      <span className="text-[10px] text-slate-500 font-mono w-8 shrink-0">{label}</span>
      <span className="text-base">{team?.flag ?? '❓'}</span>
      <span className="truncate">{team?.name ?? 'TBD'}</span>
      {isWinner && <span className="text-emerald-400 ml-auto text-xs">★</span>}
    </button>
  )
}

export default function RoundOf32Bracket({ matches, onPickWinner }: RoundOf32BracketProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Round of 32</h2>
        <p className="text-sm text-slate-400 mb-4">
          Bracket auto-populated from your group predictions. Click a team to pick the winner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {PAIRINGS.map(([a, b], pairIdx) => {
          const mA = matches[a]
          const mB = matches[b]
          if (!mA || !mB) return null

          return (
            <div key={pairIdx} className="relative">
              <div className="text-[10px] text-slate-600 font-mono mb-2 uppercase tracking-wider">
                Feeds into {PAIRINGS[pairIdx][2]}
              </div>

              <div className="space-y-2">
                <div className="match-card">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <TeamBtn
                        team={mA.home}
                        label={mA.label?.split(' vs ')[0] ?? ''}
                        side="home"
                        isWinner={mA.winner?.name === mA.home?.name}
                        onPick={() => onPickWinner(mA.id, 'home')}
                      />
                    </div>
                    <span className="text-slate-600 text-[10px] font-bold shrink-0">VS</span>
                    <div className="flex-1 min-w-0">
                      <TeamBtn
                        team={mA.away}
                        label={mA.label?.split(' vs ')[1] ?? ''}
                        side="away"
                        isWinner={mA.winner?.name === mA.away?.name}
                        onPick={() => onPickWinner(mA.id, 'away')}
                      />
                    </div>
                  </div>
                </div>

                <div className="match-card">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <TeamBtn
                        team={mB.home}
                        label={mB.label?.split(' vs ')[0] ?? ''}
                        side="home"
                        isWinner={mB.winner?.name === mB.home?.name}
                        onPick={() => onPickWinner(mB.id, 'home')}
                      />
                    </div>
                    <span className="text-slate-600 text-[10px] font-bold shrink-0">VS</span>
                    <div className="flex-1 min-w-0">
                      <TeamBtn
                        team={mB.away}
                        label={mB.label?.split(' vs ')[1] ?? ''}
                        side="away"
                        isWinner={mB.winner?.name === mB.away?.name}
                        onPick={() => onPickWinner(mB.id, 'away')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {pairIdx < PAIRINGS.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-px bg-slate-700" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
