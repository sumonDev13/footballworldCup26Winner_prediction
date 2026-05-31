'use client'

import { useMemo } from 'react'
import { Matchup, Team } from '@/types'

interface Props {
  roundOf32: Matchup[]
  roundOf16: Matchup[]
  quarterFinals: Matchup[]
  semiFinals: Matchup[]
  finalMatch: Matchup
  onPickWinner: (matchId: string, winner: Team) => void
}

const CARD_W = 148
const CARD_H = 32
const COL_GAP = 24

const colW = CARD_W + COL_GAP
const gray = '#1e293b'
const green = '#10b981'
const ROW = CARD_H + 4

const R32_PAIRS = [[1, 4], [0, 2], [3, 5], [6, 7], [10, 11], [8, 9], [13, 15], [12, 14]]
const R16_PAIRS = [[0, 1], [4, 5], [2, 3], [6, 7]]
const QF_PAIRS = [[0, 1], [2, 3]]
const LEFT_R32 = [0, 1, 2, 3, 4, 5, 6, 7]
const RIGHT_R32 = [8, 9, 10, 11, 12, 13, 14, 15]

function TeamBtn({ team, label, isWinner, onClick }: {
  team: Team | null; label: string; isWinner: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!team}
      className={`flex items-center gap-1 w-full h-full px-2 rounded text-[10px] transition-all truncate ${
        !team ? 'text-slate-700 cursor-not-allowed' :
        team && !isWinner ? 'text-slate-300 hover:bg-slate-700/50' :
        'bg-emerald-600/20 text-emerald-100'
      }`}
    >
      {team && isWinner && <span className="text-emerald-400 text-[9px] shrink-0">★</span>}
      <span className="text-sm shrink-0">{team?.flag ?? ''}</span>
      <span className="text-[8px] text-slate-500 font-mono shrink-0">{label}</span>
      <span className="truncate ml-auto">{team?.name ?? '—'}</span>
    </button>
  )
}

function MatchCard({ match, onPick }: { match: Matchup; onPick?: (t: Team) => void }) {
  const parts = match.label?.split(' vs ') ?? ['', '']
  const isFinal = match.id === 'final'
  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${
      isFinal ? 'border-yellow-500/30 bg-yellow-500/[0.04]' :
      match.winner ? 'border-emerald-600/30 bg-emerald-900/8' :
      match.home && match.away ? 'border-slate-600/50 bg-slate-800/50' :
      'border-slate-700/30 bg-slate-800/20'
    }`}>
      {isFinal && <div className="text-center text-[7px] text-yellow-400 font-semibold leading-tight bg-yellow-500/10">🏆 FINAL</div>}
      <div className="flex items-stretch" style={{ height: CARD_H - (isFinal ? 10 : 0) }}>
        <div className="flex-1 min-w-0">
          <TeamBtn team={match.home} label={parts[0] ?? ''} isWinner={match.winner?.name === match.home?.name} onClick={() => match.home && onPick?.(match.home)} />
        </div>
        <div className="flex items-center px-1"><span className="text-[6px] text-slate-600 font-bold">VS</span></div>
        <div className="flex-1 min-w-0">
          <TeamBtn team={match.away} label={parts[1] ?? ''} isWinner={match.winner?.name === match.away?.name} onClick={() => match.away && onPick?.(match.away)} />
        </div>
      </div>
    </div>
  )
}

function useBracketPositions(
  roundOf32: Matchup[], roundOf16: Matchup[], quarterFinals: Matchup[], semiFinals: Matchup[],
) {
  return useMemo(() => {
    type Pos = { x: number; y: number }
    const pos = new Map<string, Pos>()

    const MATCH_H = CARD_H + 4

    // R32: sequential vertical positions
    for (let i = 0; i < roundOf32.length; i++) {
      pos.set(roundOf32[i]?.id ?? `r32-${i + 1}`, { x: 0, y: i * MATCH_H })
    }

    // R16: each at center of its R32 pair
    for (let i = 0; i < R32_PAIRS.length; i++) {
      const [a, b] = R32_PAIRS[i]
      const pA = pos.get(roundOf32[a]?.id ?? '')
      const pB = pos.get(roundOf32[b]?.id ?? '')
      if (pA && pB && roundOf16[i]) {
        pos.set(roundOf16[i].id, { x: colW, y: (pA.y + pB.y + MATCH_H) / 2 - MATCH_H / 2 })
      }
    }

    // QF: each at center of its R16 pair
    for (let i = 0; i < R16_PAIRS.length; i++) {
      const [a, b] = R16_PAIRS[i]
      const pA = pos.get(roundOf16[a]?.id ?? '')
      const pB = pos.get(roundOf16[b]?.id ?? '')
      if (pA && pB && quarterFinals[i]) {
        pos.set(quarterFinals[i].id, { x: 2 * colW, y: (pA.y + pB.y + MATCH_H) / 2 - MATCH_H / 2 })
      }
    }

    // SF: each at center of its QF pair
    for (let i = 0; i < QF_PAIRS.length; i++) {
      const [a, b] = QF_PAIRS[i]
      const pA = pos.get(quarterFinals[a]?.id ?? '')
      const pB = pos.get(quarterFinals[b]?.id ?? '')
      if (pA && pB && semiFinals[i]) {
        pos.set(semiFinals[i].id, { x: 3 * colW, y: (pA.y + pB.y + MATCH_H) / 2 - MATCH_H / 2 })
      }
    }

    return pos
  }, [roundOf32, roundOf16, quarterFinals, semiFinals])
}

export default function BracketView({
  roundOf32, roundOf16, quarterFinals, semiFinals, finalMatch, onPickWinner,
}: Props) {
  const pos = useBracketPositions(roundOf32, roundOf16, quarterFinals, semiFinals)
  const MATCH_H = CARD_H + 4

  const leftW = 4 * colW
  const halfH = roundOf32.length * MATCH_H
  const finalPad = COL_GAP + CARD_W + COL_GAP
  const rightStart = leftW + finalPad
  const totalW = rightStart + 4 * colW

  const sf0pos = pos.get(semiFinals[0]?.id ?? '')
  const sf1pos = pos.get(semiFinals[1]?.id ?? '')
  const finalPos = (sf0pos && sf1pos)
    ? (sf0pos.y + sf1pos.y + MATCH_H) / 2 - MATCH_H / 2
    : halfH / 2 - MATCH_H / 2

  function line(x1: number, y1: number, x2: number, y2: number, color: string, key: string) {
    return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
  }

  function roundCenter(matchId: string) {
    const p = pos.get(matchId)
    return p ? p.y + MATCH_H / 2 : 0
  }

  function drawConnectors() {
    const els: JSX.Element[] = []

    // R32 → R16
    for (let i = 0; i < R32_PAIRS.length; i++) {
      const [a, b] = R32_PAIRS[i]
      const m32a = roundOf32[a]; const m32b = roundOf32[b]; const m16 = roundOf16[i]
      if (!m32a || !m32b || !m16) continue
      const pa = pos.get(m32a.id); const pb = pos.get(m32b.id); const p16 = pos.get(m16.id)
      if (!pa || !pb || !p16) continue
      const x1 = CARD_W; const x2 = CARD_W + COL_GAP / 2; const x3 = colW
      const yA = pa.y + MATCH_H / 2; const yB = pb.y + MATCH_H / 2; const yM = p16.y + MATCH_H / 2
      els.push(
        line(x1, yA, x2, yA, m32a.winner ? green : gray, `r32a-${i}`),
        line(x1, yB, x2, yB, m32b.winner ? green : gray, `r32b-${i}`),
        line(x2, yA, x2, yB, m32a.winner && m32b.winner ? green : gray, `r32v-${i}`),
        line(x2, yM, x3, yM, m16.home && m16.away ? green : gray, `r32h-${i}`),
      )
    }

    // R16 → QF
    for (let i = 0; i < R16_PAIRS.length; i++) {
      const [a, b] = R16_PAIRS[i]
      const m16a = roundOf16[a]; const m16b = roundOf16[b]; const mQf = quarterFinals[i]
      if (!m16a || !m16b || !mQf) continue
      const pa = pos.get(m16a.id); const pb = pos.get(m16b.id); const pq = pos.get(mQf.id)
      if (!pa || !pb || !pq) continue
      const off = colW; const x1 = off + CARD_W; const x2 = off + COL_GAP / 2; const x3 = off + COL_GAP
      const yA = pa.y + MATCH_H / 2; const yB = pb.y + MATCH_H / 2; const yM = pq.y + MATCH_H / 2
      els.push(
        line(x1, yA, x2, yA, m16a.winner ? green : gray, `r16a-${i}`),
        line(x1, yB, x2, yB, m16b.winner ? green : gray, `r16b-${i}`),
        line(x2, yA, x2, yB, m16a.winner && m16b.winner ? green : gray, `r16v-${i}`),
        line(x2, yM, x3, yM, mQf.home && mQf.away ? green : gray, `r16h-${i}`),
      )
    }

    // QF → SF (left side: QF[0,1] → SF[0])
    {
      const mQfA = quarterFinals[0]; const mQfB = quarterFinals[1]; const mSf = semiFinals[0]
      if (mQfA && mQfB && mSf) {
        const pa = pos.get(mQfA.id); const pb = pos.get(mQfB.id); const ps = pos.get(mSf.id)
        if (pa && pb && ps) {
          const off = 2 * colW; const x1 = off + CARD_W; const x2 = off + COL_GAP / 2; const x3 = off + COL_GAP
          const yA = pa.y + MATCH_H / 2; const yB = pb.y + MATCH_H / 2; const yM = ps.y + MATCH_H / 2
          els.push(
            line(x1, yA, x2, yA, mQfA.winner ? green : gray, 'qfa-l'),
            line(x1, yB, x2, yB, mQfB.winner ? green : gray, 'qfb-l'),
            line(x2, yA, x2, yB, mQfA.winner && mQfB.winner ? green : gray, 'qfv-l'),
            line(x2, yM, x3, yM, mSf.home && mSf.away ? green : gray, 'qfh-l'),
          )
        }
      }
    }

    // QF → SF (right side: QF[2,3] → SF[1])
    {
      const mQfA = quarterFinals[2]; const mQfB = quarterFinals[3]; const mSf = semiFinals[1]
      if (mQfA && mQfB && mSf) {
        const pA = pos.get(mQfA.id); const pB = pos.get(mQfB.id); const pS = pos.get(mSf.id)
        if (pA && pB && pS) {
          const off = 2 * colW; const x1 = off + CARD_W; const x2 = off + COL_GAP / 2; const x3 = off + COL_GAP
          const yA = pA.y + MATCH_H / 2; const yB = pB.y + MATCH_H / 2; const yM = pS.y + MATCH_H / 2
          els.push(
            line(x1, yA, x2, yA, mQfA.winner ? green : gray, 'qfa-r'),
            line(x1, yB, x2, yB, mQfB.winner ? green : gray, 'qfb-r'),
            line(x2, yA, x2, yB, mQfA.winner && mQfB.winner ? green : gray, 'qfv-r'),
            line(x2, yM, x3, yM, mSf.home && mSf.away ? green : gray, 'qfh-r'),
          )
        }
      }
    }

    // SF → Final (left)
    {
      const pA = pos.get(semiFinals[0]?.id ?? ''); const pB = pos.get(semiFinals[1]?.id ?? '')
      if (pA) {
        const off = 3 * colW; const x1 = off + CARD_W; const x2 = off + COL_GAP / 2
        const x3 = leftW + COL_GAP / 2
        const y = pA.y + MATCH_H / 2
        const col = semiFinals[0]?.winner ? green : gray
        els.push(
          line(x1, y, x2, y, col, 'sf-l'),
          line(x2, y, x3, y, col, 'sf-h-l'),
        )
      }
      if (pB) {
        const off = rightStart; const x1 = off; const x2 = off - COL_GAP / 2
        const x3 = leftW + COL_GAP / 2
        const y = pB.y + MATCH_H / 2
        const col = semiFinals[1]?.winner ? green : gray
        els.push(
          line(x2, y, x3, y, col, 'sf-h-r'),
          line(x1, y, x2, y, col, 'sf-r'),
        )
      }
    }

    // Right side connectors
    for (let i = 0; i < R32_PAIRS.length; i++) {
      const [a, b] = R32_PAIRS[i]
      // R32 → R16
      {
        const m32a = roundOf32[a]; const m32b = roundOf32[b]; const m16 = roundOf16[i]
        if (m32a && m32b && m16) {
          const pa = pos.get(m32a.id); const pb = pos.get(m32b.id); const p16 = pos.get(m16.id)
          if (pa && pb && p16) {
            const r32X = rightStart + 3 * colW
            const x1 = r32X; const x2 = r32X - COL_GAP / 2; const x3 = rightStart + 2 * colW
            const yA = pa.y + MATCH_H / 2; const yB = pb.y + MATCH_H / 2; const yM = p16.y + MATCH_H / 2
            els.push(
              line(x1, yA, x2, yA, m32a.winner ? green : gray, `r32a-r-${i}`),
              line(x1, yB, x2, yB, m32b.winner ? green : gray, `r32b-r-${i}`),
              line(x2, yA, x2, yB, m32a.winner && m32b.winner ? green : gray, `r32v-r-${i}`),
              line(x2, yM, x3, yM, m16.home && m16.away ? green : gray, `r32h-r-${i}`),
            )
          }
        }
      }
      // R16 → QF (right)
      if (i < 4) {
        const r16a = roundOf16[R16_PAIRS[i][0]]; const r16b = roundOf16[R16_PAIRS[i][1]]
        const qf = quarterFinals[i]
        if (r16a && r16b && qf) {
          const pa = pos.get(r16a.id); const pb = pos.get(r16b.id); const pq = pos.get(qf.id)
          if (pa && pb && pq) {
            const off = rightStart + 2 * colW; const x1 = off; const x2 = off - COL_GAP / 2; const x3 = rightStart + colW
            const yA = pa.y + MATCH_H / 2; const yB = pb.y + MATCH_H / 2; const yM = pq.y + MATCH_H / 2
            els.push(
              line(x1, yA, x2, yA, r16a.winner ? green : gray, `r16a-r-${i}`),
              line(x1, yB, x2, yB, r16b.winner ? green : gray, `r16b-r-${i}`),
              line(x2, yA, x2, yB, r16a.winner && r16b.winner ? green : gray, `r16v-r-${i}`),
              line(x2, yM, x3, yM, qf.home && qf.away ? green : gray, `r16h-r-${i}`),
            )
          }
        }
      }
    }

    // QF → SF (right)
    {
      const mQfA = quarterFinals[2]; const mQfB = quarterFinals[3]; const mSf = semiFinals[1]
      if (mQfA && mQfB && mSf) {
        const pA = pos.get(mQfA.id); const pB = pos.get(mQfB.id); const pS = pos.get(mSf.id)
        if (pA && pB && pS) {
          const off = rightStart + colW; const x1 = off; const x2 = off - COL_GAP / 2; const x3 = rightStart
          const yA = pA.y + MATCH_H / 2; const yB = pB.y + MATCH_H / 2; const yM = pS.y + MATCH_H / 2
          els.push(
            line(x1, yA, x2, yA, mQfA.winner ? green : gray, 'qfa-r'),
            line(x1, yB, x2, yB, mQfB.winner ? green : gray, 'qfb-r'),
            line(x2, yA, x2, yB, mQfA.winner && mQfB.winner ? green : gray, 'qfv-r'),
            line(x2, yM, x3, yM, mSf.home && mSf.away ? green : gray, 'qfh-r'),
          )
        }
      }
    }

    return els
  }

  const leftR16 = [0, 1, 4, 5]
  const rightR16 = [2, 3, 6, 7]
  const leftQf = [0, 1]
  const rightQf = [2, 3]

  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <div style={{ width: totalW, minWidth: totalW }} className="mx-auto">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Knockout Bracket</h2>
        <p className="text-sm text-slate-400 mb-6 text-center">Click a team in each match to pick the winner.</p>

        <div className="relative" style={{ height: halfH }}>
          {/* ===== LEFT BRACKET ===== */}
          {/* R32 (left half: indices 0-7) */}
          {LEFT_R32.map((r32Idx, i) => {
            const m = roundOf32[r32Idx]; if (!m) return null
            const p = pos.get(m.id); if (!p) return null
            return (
              <div key={m.id} className="absolute" style={{ left: p.x, top: p.y }}>
                <MatchCard match={m} onPick={(t) => onPickWinner(m.id, t)} />
              </div>
            )
          })}
          {/* R16 */}
          {roundOf16.map((m, i) => {
            if (!leftR16.includes(i)) return null
            const p = pos.get(m.id); if (!p) return null
            return (
              <div key={m.id} className="absolute" style={{ left: p.x, top: p.y }}>
                <MatchCard match={m} onPick={(t) => onPickWinner(m.id, t)} />
              </div>
            )
          })}
          {/* QF */}
          {quarterFinals.map((m, i) => {
            if (!leftQf.includes(i)) return null
            const p = pos.get(m.id); if (!p) return null
            return (
              <div key={m.id} className="absolute" style={{ left: p.x, top: p.y }}>
                <MatchCard match={m} onPick={(t) => onPickWinner(m.id, t)} />
              </div>
            )
          })}
          {/* SF-0 */}
          {semiFinals[0] && (() => {
            const m = semiFinals[0]; const p = pos.get(m.id); if (!p) return null
            return (
              <div key={m.id} className="absolute" style={{ left: p.x, top: p.y }}>
                <MatchCard match={m} onPick={(t) => onPickWinner(m.id, t)} />
              </div>
            )
          })()}

          {/* ===== RIGHT BRACKET ===== */}
          {/* R32 (right half: indices 8-15) */}
          {RIGHT_R32.map((r32Idx, i) => {
            const m = roundOf32[r32Idx]; if (!m) return null
            const p = pos.get(m.id); if (!p) return null
            return (
              <div key={`r-${m.id}`} className="absolute" style={{ left: rightStart + 3 * colW, top: p.y }}>
                <MatchCard match={m} onPick={(t) => onPickWinner(m.id, t)} />
              </div>
            )
          })}
          {/* R16 */}
          {roundOf16.map((m, i) => {
            if (!rightR16.includes(i)) return null
            const p = pos.get(m.id); if (!p) return null
            return (
              <div key={`r-${m.id}`} className="absolute" style={{ left: rightStart + 2 * colW, top: p.y }}>
                <MatchCard match={m} onPick={(t) => onPickWinner(m.id, t)} />
              </div>
            )
          })}
          {/* QF */}
          {quarterFinals.map((m, i) => {
            if (!rightQf.includes(i)) return null
            const p = pos.get(m.id); if (!p) return null
            return (
              <div key={`r-${m.id}`} className="absolute" style={{ left: rightStart + colW, top: p.y }}>
                <MatchCard match={m} onPick={(t) => onPickWinner(m.id, t)} />
              </div>
            )
          })}
          {/* SF-1 */}
          {semiFinals[1] && (() => {
            const m = semiFinals[1]; const p = pos.get(m.id); if (!p) return null
            return (
              <div key={`r-${m.id}`} className="absolute" style={{ left: rightStart, top: p.y }}>
                <MatchCard match={m} onPick={(t) => onPickWinner(m.id, t)} />
              </div>
            )
          })()}

          {/* ===== FINAL CENTER ===== */}
          <div className="absolute flex flex-col items-center" style={{
            left: leftW + COL_GAP, top: finalPos, width: CARD_W,
          }}>
            <MatchCard match={finalMatch} onPick={(t) => onPickWinner('final', t)} />
            {finalMatch.winner && (
              <div className="mt-1 text-[10px] text-emerald-400 font-semibold text-center leading-tight">
                🏆 {finalMatch.winner.flag} {finalMatch.winner.name}
              </div>
            )}
          </div>

          {/* ===== SVG CONNECTORS ===== */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={totalW} height={halfH}
            style={{ overflow: 'visible' }}
          >
            {drawConnectors()}
          </svg>
        </div>
      </div>
    </div>
  )
}
