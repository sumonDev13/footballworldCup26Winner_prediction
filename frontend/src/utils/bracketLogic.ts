import { Team, Matchup, GroupPositions, PredictionState, GROUP_LABELS } from '@/types'

export interface R32SlotDef {
  matchId: string
  homeLabel: string
  awayLabel: string
  homeType: 'winner' | 'runner-up' | 'third'
  homeGroup: string
  awayType: 'winner' | 'runner-up' | 'third'
  awayGroup: string
  thirdPool?: string[]
}

const R32_DEFINITIONS: R32SlotDef[] = [
  { matchId: 'r32-1', homeLabel: '2A', awayLabel: '2B', homeType: 'runner-up', homeGroup: 'A', awayType: 'runner-up', awayGroup: 'B' },
  { matchId: 'r32-2', homeLabel: '1E', awayLabel: '3rd', homeType: 'winner', homeGroup: 'E', awayType: 'third', awayGroup: '', thirdPool: ['A', 'B', 'C', 'D', 'F'] },
  { matchId: 'r32-3', homeLabel: '1F', awayLabel: '2C', homeType: 'winner', homeGroup: 'F', awayType: 'runner-up', awayGroup: 'C' },
  { matchId: 'r32-4', homeLabel: '1C', awayLabel: '2F', homeType: 'winner', homeGroup: 'C', awayType: 'runner-up', awayGroup: 'F' },
  { matchId: 'r32-5', homeLabel: '1I', awayLabel: '3rd', homeType: 'winner', homeGroup: 'I', awayType: 'third', awayGroup: '', thirdPool: ['C', 'D', 'F', 'G', 'H'] },
  { matchId: 'r32-6', homeLabel: '2E', awayLabel: '2I', homeType: 'runner-up', homeGroup: 'E', awayType: 'runner-up', awayGroup: 'I' },
  { matchId: 'r32-7', homeLabel: '1A', awayLabel: '3rd', homeType: 'winner', homeGroup: 'A', awayType: 'third', awayGroup: '', thirdPool: ['C', 'E', 'F', 'H', 'I'] },
  { matchId: 'r32-8', homeLabel: '1L', awayLabel: '3rd', homeType: 'winner', homeGroup: 'L', awayType: 'third', awayGroup: '', thirdPool: ['E', 'H', 'I', 'J', 'K'] },
  { matchId: 'r32-9', homeLabel: '1D', awayLabel: '3rd', homeType: 'winner', homeGroup: 'D', awayType: 'third', awayGroup: '', thirdPool: ['B', 'E', 'F', 'I', 'J'] },
  { matchId: 'r32-10', homeLabel: '1G', awayLabel: '3rd', homeType: 'winner', homeGroup: 'G', awayType: 'third', awayGroup: '', thirdPool: ['A', 'E', 'H', 'I', 'J'] },
  { matchId: 'r32-11', homeLabel: '2K', awayLabel: '2L', homeType: 'runner-up', homeGroup: 'K', awayType: 'runner-up', awayGroup: 'L' },
  { matchId: 'r32-12', homeLabel: '1H', awayLabel: '2J', homeType: 'winner', homeGroup: 'H', awayType: 'runner-up', awayGroup: 'J' },
  { matchId: 'r32-13', homeLabel: '1B', awayLabel: '3rd', homeType: 'winner', homeGroup: 'B', awayType: 'third', awayGroup: '', thirdPool: ['E', 'F', 'G', 'I', 'J'] },
  { matchId: 'r32-14', homeLabel: '1J', awayLabel: '2H', homeType: 'winner', homeGroup: 'J', awayType: 'runner-up', awayGroup: 'H' },
  { matchId: 'r32-15', homeLabel: '1K', awayLabel: '3rd', homeType: 'winner', homeGroup: 'K', awayType: 'third', awayGroup: '', thirdPool: ['D', 'E', 'I', 'J', 'L'] },
  { matchId: 'r32-16', homeLabel: '2D', awayLabel: '2G', homeType: 'runner-up', homeGroup: 'D', awayType: 'runner-up', awayGroup: 'G' },
]

export function getThirdPlacePools(): Record<string, string[]> {
  const pools: Record<string, string[]> = {}
  for (const def of R32_DEFINITIONS) {
    if (def.awayType === 'third' && def.thirdPool) {
      pools[def.matchId] = def.thirdPool
    }
  }
  return pools
}

export function assignThirdPlaced(
  selectedThird: Team[],
  _groups: Record<string, GroupPositions>
): Record<string, Team> {
  const pools = getThirdPlacePools()
  const slotIds = Object.keys(pools)
  const result: Record<string, Team> = {}
  const used = new Set<string>()

  const sortedSlots = slotIds
    .map(id => ({ id, pool: pools[id] }))
    .sort((a, b) => a.pool.length - b.pool.length)

  function backtrack(idx: number): boolean {
    if (idx === sortedSlots.length) return true
    const { id, pool } = sortedSlots[idx]

    for (const team of selectedThird) {
      if (used.has(team.name)) continue
      if (!pool.includes(team.group)) continue

      used.add(team.name)
      result[id] = team
      if (backtrack(idx + 1)) return true
      used.delete(team.name)
      delete result[id]
    }
    return false
  }

  backtrack(0)
  return result
}

export function getTeamFromGroup(
  groups: Record<string, GroupPositions>,
  group: string,
  type: 'winner' | 'runner-up'
): Team | null {
  const g = groups[group]
  if (!g) return null
  return type === 'winner' ? g.first : g.second
}

export function buildRoundOf32(
  groups: Record<string, GroupPositions>,
  selectedThird: Team[]
): Matchup[] {
  const thirdAssignments = assignThirdPlaced(selectedThird, groups)

  return R32_DEFINITIONS.map(def => {
    let home: Team | null = null
    let away: Team | null = null

    if (def.homeType === 'third') {
      home = thirdAssignments[def.matchId] ?? null
    } else {
      home = getTeamFromGroup(groups, def.homeGroup, def.homeType as 'winner' | 'runner-up')
    }

    if (def.awayType === 'third') {
      away = thirdAssignments[def.matchId] ?? null
    } else {
      away = getTeamFromGroup(groups, def.awayGroup, def.awayType as 'winner' | 'runner-up')
    }

    return {
      id: def.matchId,
      home,
      away,
      winner: null,
      label: `${def.homeLabel} vs ${def.awayLabel}`,
    }
  })
}

type Pairings = [number, number][]

const R32_TO_R16: Pairings = [[1, 4], [0, 2], [3, 5], [6, 7], [10, 11], [8, 9], [13, 15], [12, 14]]
const R16_TO_QF: Pairings = [[0, 1], [4, 5], [2, 3], [6, 7]]
const QF_TO_SF: Pairings = [[0, 1], [2, 3]]

const NEXT_ID: Record<string, string> = {
  '16': 'r16',
  '8': 'qf',
  '4': 'sf',
  '2': 'final',
}

export function buildNextRound(prevMatches: Matchup[]): Matchup[] {
  const winners = prevMatches.map(m => m.winner)
  const count = winners.length

  if (count <= 1) return []
  if (count === 2) return [{ id: 'final', home: winners[0] ?? null, away: winners[1] ?? null, winner: null }]

  const pairings = count === 16 ? R32_TO_R16 : count === 8 ? R16_TO_QF : count === 4 ? QF_TO_SF : []
  const prefix = NEXT_ID[String(count)] ?? ''

  return pairings.map(([a, b], i) => ({
    id: `${prefix}-${i + 1}`,
    home: winners[a] ?? null,
    away: winners[b] ?? null,
    winner: null,
  }))
}

export function getThirdPlacedTeams(groups: Record<string, GroupPositions>): Team[] {
  const third: Team[] = []
  for (const label of GROUP_LABELS) {
    const g = groups[label]
    if (g?.third) third.push({ ...g.third, group: label })
  }
  third.sort((a, b) => a.fifaRanking - b.fifaRanking)
  return third
}

export function isStepComplete(step: string, state: PredictionState): boolean {
  switch (step) {
    case 'groups':
      return Object.values(state.groups).every(g => g.first && g.second)
    case 'third-placed':
      return state.selectedThird.length === 8
    case 'round-of-32':
      return state.roundOf32.length > 0 && state.roundOf32.every(m => m.winner !== null)
    case 'round-of-16':
      return state.roundOf16.length > 0 && state.roundOf16.every(m => m.winner !== null)
    case 'quarter-finals':
      return state.quarterFinals.length > 0 && state.quarterFinals.every(m => m.winner !== null)
    case 'semi-finals':
      return state.semiFinals.length > 0 && state.semiFinals.every(m => m.winner !== null)
    case 'final':
      return state.final.winner !== null
    default:
      return false
  }
}
