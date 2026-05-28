'use client'

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Team, Matchup } from '@/types'

interface KnockoutRoundProps {
  title: string
  matches: Matchup[]
  teamPool?: Team[]
  onMatchUpdate: (matchId: string, winner: Team) => void
  onPoolAssign?: (matchId: string, team: Team) => void
  showPool?: boolean
}

export default function KnockoutRound({
  title,
  matches,
  teamPool,
  onMatchUpdate,
  onPoolAssign,
  showPool,
}: KnockoutRoundProps) {
  function onDragEnd(result: DropResult) {
    if (!result.destination) return

    const draggableId = result.draggableId
    const destId = result.destination.droppableId

    if (destId.startsWith('pool-')) return

    if (destId.startsWith('slot-') && onPoolAssign && result.source.droppableId.startsWith('pool-')) {
      const teamName = draggableId.replace('team-', '')
      const matchId = destId.replace('slot-', '')
      const team = teamPool?.find(t => t.name === teamName)
      if (team) {
        onPoolAssign(matchId, team)
      }
      return
    }
  }

  function getQualifiedCount(): number {
    return matches.filter(m => m.home && m.away).length * 2
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>

      {showPool && teamPool && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-2">
              Qualified Teams ({teamPool.length})
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Drag teams from the pool into the bracket slots below
            </p>
            <Droppable droppableId="pool-teams" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap gap-2 p-3 rounded-xl min-h-[60px] border ${
                    snapshot.isDraggingOver
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-slate-700/50 bg-slate-800/40'
                  }`}
                >
                  {teamPool.map((team, idx) => (
                    <Draggable key={team.name} draggableId={`team-${team.name}`} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            draggable-team flex items-center gap-1.5 text-sm
                            ${snapshot.isDragging ? 'shadow-lg scale-105' : ''}
                          `}
                        >
                          <span>{team.flag}</span>
                          <span>{team.name}</span>
                          <span className="text-[10px] text-slate-500 ml-1">({team.group})</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="space-y-3">
            {matches.map((match, idx) => (
              <div key={match.id} className="match-card">
                <div className="text-[10px] text-slate-600 mb-1.5 font-mono">
                  Match {idx + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Droppable droppableId={`slot-${match.id}-home`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 droppable-slot ${snapshot.isDraggingOver ? 'droppable-slot--active' : ''}`}
                        onClick={() => {}}
                      >
                        {match.home ? (
                          <div className="flex items-center gap-1.5 text-sm px-2 py-1">
                            <span>{match.home.flag}</span>
                            <span className="text-slate-200">{match.home.name}</span>
                            {match.winner?.name === match.home.name && (
                              <span className="text-emerald-400 text-xs ml-1">★</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs">Drop team here</span>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <span className="text-slate-600 text-xs font-bold">VS</span>

                  <Droppable droppableId={`slot-${match.id}-away`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 droppable-slot ${snapshot.isDraggingOver ? 'droppable-slot--active' : ''}`}
                      >
                        {match.away ? (
                          <div className="flex items-center gap-1.5 text-sm px-2 py-1">
                            <span>{match.away.flag}</span>
                            <span className="text-slate-200">{match.away.name}</span>
                            {match.winner?.name === match.away.name && (
                              <span className="text-emerald-400 text-xs ml-1">★</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs">Drop team here</span>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {match.home && match.away && (
                  <div className="mt-2 flex gap-2 justify-center">
                    <button
                      onClick={() => onMatchUpdate(match.id, match.home!)}
                      className={`text-xs px-3 py-1 rounded-md transition-colors ${
                        match.winner?.name === match.home?.name
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {match.home.flag} {match.home.name} Wins
                    </button>
                    <button
                      onClick={() => onMatchUpdate(match.id, match.away!)}
                      className={`text-xs px-3 py-1 rounded-md transition-colors ${
                        match.winner?.name === match.away?.name
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {match.away.flag} {match.away.name} Wins
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {!showPool && (
        <div className="space-y-3">
          {matches.map((match, idx) => (
            <div key={match.id} className="match-card">
              <div className="text-[10px] text-slate-600 mb-1.5 font-mono">
                Match {idx + 1}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => match.home && onMatchUpdate(match.id, match.home)}
                  disabled={!match.home}
                  className={`flex-1 flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg transition-colors ${
                    !match.home
                      ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                      : match.winner?.name === match.home?.name
                        ? 'bg-emerald-700/40 text-emerald-200 ring-1 ring-emerald-500/50'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{match.home?.flag ?? '❓'}</span>
                  <span>{match.home?.name ?? 'TBD'}</span>
                </button>

                <span className="text-slate-600 text-[10px] font-bold">VS</span>

                <button
                  onClick={() => match.away && onMatchUpdate(match.id, match.away)}
                  disabled={!match.away}
                  className={`flex-1 flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg transition-colors justify-end ${
                    !match.away
                      ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                      : match.winner?.name === match.away?.name
                        ? 'bg-emerald-700/40 text-emerald-200 ring-1 ring-emerald-500/50'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{match.away?.name ?? 'TBD'}</span>
                  <span>{match.away?.flag ?? '❓'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
