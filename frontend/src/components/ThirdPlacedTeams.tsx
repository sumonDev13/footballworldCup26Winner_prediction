'use client'

import { Team } from '@/types'

interface ThirdPlacedTeamsProps {
  teams: Team[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
}

export default function ThirdPlacedTeams({ teams, selected, onSelectionChange }: ThirdPlacedTeamsProps) {
  function toggle(teamName: string) {
    if (selected.includes(teamName)) {
      onSelectionChange(selected.filter(n => n !== teamName))
    } else if (selected.length < 8) {
      onSelectionChange([...selected, teamName])
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Best Third-Placed Teams</h2>
        <p className="text-sm text-slate-400 mt-1">
          The <span className="text-emerald-400 font-semibold">top 8</span> third-placed teams across all 12 groups advance to the Round of 32.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left w-10">#</th>
              <th className="px-4 py-3 text-left">Group</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-right pr-6">FIFA Rank</th>
              <th className="px-4 py-3 text-center w-24">Advance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {teams.map((team, i) => {
              const isSelected = selected.includes(team.name)
              const rank = i + 1
              const isCutoff = rank === 9
              const isIn = rank <= 8
              const canSelect = !isSelected && selected.length < 8

              return (
                <tr
                  key={team.name}
                  className={`
                    transition-colors cursor-pointer
                    ${isSelected ? 'bg-emerald-900/20' : 'hover:bg-slate-800/50'}
                    ${!isIn && !isSelected ? 'opacity-40' : ''}
                  `}
                  onClick={() => toggle(team.name)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${rank <= 8
                          ? 'bg-emerald-600/20 text-emerald-400'
                          : 'bg-red-600/20 text-red-400'
                        }
                      `}>
                        {rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-700/60 text-slate-300 text-xs px-2 py-0.5 rounded font-mono">
                      {team.group}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{team.flag}</span>
                      <span className={`font-medium ${isSelected ? 'text-emerald-200' : 'text-white'}`}>
                        {team.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-emerald-600/30 text-emerald-400 px-1.5 py-0.5 rounded">
                          ADVANCED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right pr-6">
                    <span className="text-slate-400 font-mono text-xs">{team.fifaRanking}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggle(team.name) }}
                      disabled={!canSelect && !isSelected}
                      className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all mx-auto
                        ${isSelected
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : canSelect
                            ? 'border-slate-500 hover:border-emerald-400 text-transparent group-hover:text-slate-400'
                            : 'border-slate-700 text-transparent cursor-not-allowed'
                        }
                      `}
                    >
                      {isSelected && <span className="text-sm font-bold">✓</span>}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="border-t border-slate-700/60 bg-slate-800/40 px-4 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Qualified:</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold
                    ${i < selected.length ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-500'}
                  `}
                >
                  {i < selected.length ? '✓' : ''}
                </div>
              ))}
            </div>
            <span className="text-slate-500">
              {selected.length}/8 selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(selected.length / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
