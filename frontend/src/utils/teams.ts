import { Team } from '@/types'

export const allTeams: Team[] = [
  { name: 'Mexico', flag: '🇲🇽', group: 'A', fifaRanking: 14 },
  { name: 'South Africa', flag: '🇿🇦', group: 'A', fifaRanking: 66 },
  { name: 'Korea Republic', flag: '🇰🇷', group: 'A', fifaRanking: 23 },
  { name: 'Czechia', flag: '🇨🇿', group: 'A', fifaRanking: 42 },

  { name: 'Canada', flag: '🇨🇦', group: 'B', fifaRanking: 48 },
  { name: 'Bosnia and Herzegovina', flag: '🇧🇦', group: 'B', fifaRanking: 57 },
  { name: 'Qatar', flag: '🇶🇦', group: 'B', fifaRanking: 51 },
  { name: 'Switzerland', flag: '🇨🇭', group: 'B', fifaRanking: 15 },

  { name: 'Brazil', flag: '🇧🇷', group: 'C', fifaRanking: 5 },
  { name: 'Morocco', flag: '🇲🇦', group: 'C', fifaRanking: 13 },
  { name: 'Haiti', flag: '🇭🇹', group: 'C', fifaRanking: 89 },
  { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', fifaRanking: 39 },

  { name: 'USA', flag: '🇺🇸', group: 'D', fifaRanking: 11 },
  { name: 'Paraguay', flag: '🇵🇾', group: 'D', fifaRanking: 56 },
  { name: 'Australia', flag: '🇦🇺', group: 'D', fifaRanking: 27 },
  { name: 'Türkiye', flag: '🇹🇷', group: 'D', fifaRanking: 28 },

  { name: 'Germany', flag: '🇩🇪', group: 'E', fifaRanking: 9 },
  { name: 'Curaçao', flag: '🇨🇼', group: 'E', fifaRanking: 79 },
  { name: "Côte d'Ivoire", flag: '🇨🇮', group: 'E', fifaRanking: 40 },
  { name: 'Ecuador', flag: '🇪🇨', group: 'E', fifaRanking: 36 },

  { name: 'Netherlands', flag: '🇳🇱', group: 'F', fifaRanking: 7 },
  { name: 'Japan', flag: '🇯🇵', group: 'F', fifaRanking: 18 },
  { name: 'Sweden', flag: '🇸🇪', group: 'F', fifaRanking: 22 },
  { name: 'Tunisia', flag: '🇹🇳', group: 'F', fifaRanking: 30 },

  { name: 'Belgium', flag: '🇧🇪', group: 'G', fifaRanking: 4 },
  { name: 'Egypt', flag: '🇪🇬', group: 'G', fifaRanking: 34 },
  { name: 'IR Iran', flag: '🇮🇷', group: 'G', fifaRanking: 24 },
  { name: 'New Zealand', flag: '🇳🇿', group: 'G', fifaRanking: 104 },

  { name: 'Spain', flag: '🇪🇸', group: 'H', fifaRanking: 8 },
  { name: 'Cabo Verde', flag: '🇨🇻', group: 'H', fifaRanking: 76 },
  { name: 'Saudi Arabia', flag: '🇸🇦', group: 'H', fifaRanking: 53 },
  { name: 'Uruguay', flag: '🇺🇾', group: 'H', fifaRanking: 12 },

  { name: 'France', flag: '🇫🇷', group: 'I', fifaRanking: 2 },
  { name: 'Senegal', flag: '🇸🇳', group: 'I', fifaRanking: 20 },
  { name: 'Iraq', flag: '🇮🇶', group: 'I', fifaRanking: 70 },
  { name: 'Norway', flag: '🇳🇴', group: 'I', fifaRanking: 47 },

  { name: 'Argentina', flag: '🇦🇷', group: 'J', fifaRanking: 1 },
  { name: 'Algeria', flag: '🇩🇿', group: 'J', fifaRanking: 38 },
  { name: 'Austria', flag: '🇦🇹', group: 'J', fifaRanking: 25 },
  { name: 'Jordan', flag: '🇯🇴', group: 'J', fifaRanking: 91 },

  { name: 'Portugal', flag: '🇵🇹', group: 'K', fifaRanking: 6 },
  { name: 'Congo DR', flag: '🇨🇩', group: 'K', fifaRanking: 65 },
  { name: 'Uzbekistan', flag: '🇺🇿', group: 'K', fifaRanking: 64 },
  { name: 'Colombia', flag: '🇨🇴', group: 'K', fifaRanking: 17 },

  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', fifaRanking: 3 },
  { name: 'Croatia', flag: '🇭🇷', group: 'L', fifaRanking: 10 },
  { name: 'Ghana', flag: '🇬🇭', group: 'L', fifaRanking: 60 },
  { name: 'Panama', flag: '🇵🇦', group: 'L', fifaRanking: 45 },
]

export function getTeamsByGroup(group: string): Team[] {
  return allTeams.filter(t => t.group === group)
}

export const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
