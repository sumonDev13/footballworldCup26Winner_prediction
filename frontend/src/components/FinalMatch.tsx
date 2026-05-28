'use client'

import { Matchup, Team } from '@/types'

interface FinalMatchProps {
  match: Matchup
  onSelectWinner: (winner: Team) => void
}

export default function FinalMatch({ match, onSelectWinner }: FinalMatchProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="text-center">
        <span className="text-5xl block mb-2">🏆</span>
        <h2 className="text-2xl font-bold text-white">Final</h2>
        <p className="text-sm text-slate-400 mt-1">Click the team you predict will win</p>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => match.home && onSelectWinner(match.home)}
          disabled={!match.home}
          className={`
            flex flex-col items-center gap-3 px-10 py-8 rounded-2xl transition-all min-w-[180px]
            ${!match.home
              ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
              : match.winner?.name === match.home?.name
                ? 'bg-emerald-700/30 ring-2 ring-emerald-400 shadow-lg shadow-emerald-900/30 scale-105'
                : 'bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/40 hover:bg-slate-800'
            }
          `}
        >
          <span className="text-5xl mb-2">{match.home?.flag ?? '❓'}</span>
          <span className="text-lg font-bold text-white">{match.home?.name ?? 'TBD'}</span>
          {match.winner?.name === match.home?.name && (
            <span className="text-emerald-400 text-sm font-semibold mt-2">👑 Champion</span>
          )}
        </button>

        <span className="text-2xl text-slate-600 font-bold">VS</span>

        <button
          onClick={() => match.away && onSelectWinner(match.away)}
          disabled={!match.away}
          className={`
            flex flex-col items-center gap-3 px-10 py-8 rounded-2xl transition-all min-w-[180px]
            ${!match.away
              ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
              : match.winner?.name === match.away?.name
                ? 'bg-emerald-700/30 ring-2 ring-emerald-400 shadow-lg shadow-emerald-900/30 scale-105'
                : 'bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/40 hover:bg-slate-800'
            }
          `}
        >
          <span className="text-5xl mb-2">{match.away?.flag ?? '❓'}</span>
          <span className="text-lg font-bold text-white">{match.away?.name ?? 'TBD'}</span>
          {match.winner?.name === match.away?.name && (
            <span className="text-emerald-400 text-sm font-semibold mt-2">👑 Champion</span>
          )}
        </button>
      </div>
    </div>
  )
}
