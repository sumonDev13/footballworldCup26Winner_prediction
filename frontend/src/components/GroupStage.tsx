'use client'

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Team, GroupPositions, GROUP_LABELS } from '@/types'
import { getTeamsByGroup } from '@/utils/teams'

interface GroupStageProps {
  groups: Record<string, GroupPositions>
  onGroupsChange: (groups: Record<string, GroupPositions>) => void
}

function makeInitialPositions(label: string): GroupPositions {
  const teams = getTeamsByGroup(label)
  return {
    first: teams[0] ?? null,
    second: teams[1] ?? null,
    third: teams[2] ?? null,
    fourth: teams[3] ?? null,
  }
}

function positionsToArray(positions: GroupPositions): (Team | null)[] {
  return [positions.first, positions.second, positions.third, positions.fourth]
}

function arrayToPositions(arr: (Team | null)[]): GroupPositions {
  return { first: arr[0] ?? null, second: arr[1] ?? null, third: arr[2] ?? null, fourth: arr[3] ?? null }
}

export function initGroups(): Record<string, GroupPositions> {
  const groups: Record<string, GroupPositions> = {}
  for (const label of GROUP_LABELS) {
    groups[label] = makeInitialPositions(label)
  }
  return groups
}

export default function GroupStage({ groups, onGroupsChange }: GroupStageProps) {
  function onDragEnd(result: DropResult) {
    if (!result.destination) return

    const groupLabel = result.source.droppableId.replace('group-', '')
    const group = groups[groupLabel]
    if (!group) return

    const items = positionsToArray(group)
    const [removed] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, removed)
    const updated = { ...groups, [groupLabel]: arrayToPositions(items) }
    onGroupsChange(updated)
  }

  const labelToName: Record<string, string> = {
    A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F',
    G: 'G', H: 'H', I: 'I', J: 'J', K: 'K', L: 'L',
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {GROUP_LABELS.map(label => {
          const group = groups[label]
          if (!group) return null
          const items = positionsToArray(group)
          const positionLabels = ['1st', '2nd', '3rd', '4th']

          return (
            <div key={label} className="group-card">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="bg-emerald-600/30 text-emerald-400 text-xs px-2 py-0.5 rounded">Group {labelToName[label] ?? label}</span>
                <span className="text-xs text-slate-500 font-normal">
                  (drag to rank)
                </span>
              </h3>
              <Droppable droppableId={`group-${label}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-1.5 min-h-[180px] rounded-lg p-1 ${
                      snapshot.isDraggingOver ? 'bg-emerald-500/10' : ''
                    }`}
                  >
                    {items.map((team, idx) => (
                      <Draggable key={team?.name ?? `empty-${idx}`} draggableId={team?.name ?? `empty-${idx}`} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              draggable-team flex items-center gap-2 text-sm
                              ${snapshot.isDragging ? 'shadow-lg shadow-emerald-900/30 rotate-2 scale-105' : ''}
                              ${idx === 0 ? 'border-emerald-500/40 bg-emerald-700/20' : ''}
                              ${idx === 1 ? 'border-blue-500/30 bg-blue-700/15' : ''}
                            `}
                          >
                            <span className="text-xs font-mono text-slate-500 w-5 text-right">
                              {positionLabels[idx]}
                            </span>
                            <span className="text-base">{team?.flag}</span>
                            <span className="text-slate-200">{team?.name}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="mt-2 flex gap-1 text-[10px] text-slate-500">
                <span className="text-emerald-400">▲</span> Top 2 advance to R32
              </div>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
