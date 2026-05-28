export interface Team {
  name: string
  flag: string
  group: string
  fifaRanking: number
}

export interface GroupPositions {
  first: Team | null
  second: Team | null
  third: Team | null
  fourth: Team | null
}

export interface Matchup {
  id: string
  home: Team | null
  away: Team | null
  winner: Team | null
  label?: string
}

export interface BracketSlot {
  matchId: string
  type: 'winner' | 'runner-up' | 'third'
  source: string
  label: string
}

export interface PredictionState {
  groups: Record<string, GroupPositions>
  selectedThird: string[]
  roundOf32: Matchup[]
  roundOf16: Matchup[]
  quarterFinals: Matchup[]
  semiFinals: Matchup[]
  final: Matchup
  champion: Team | null
}

export type Step =
  | 'groups'
  | 'third-placed'
  | 'round-of-32'
  | 'round-of-16'
  | 'quarter-finals'
  | 'semi-finals'
  | 'final'
  | 'result'

export const ROUND_LABELS: Record<Step, string> = {
  groups: 'Group Stage',
  'third-placed': 'Best Third',
  'round-of-32': 'Round of 32',
  'round-of-16': 'Round of 16',
  'quarter-finals': 'Quarter-finals',
  'semi-finals': 'Semi-finals',
  final: 'Final',
  result: 'Champion',
}

export const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
