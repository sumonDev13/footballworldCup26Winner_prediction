'use client'

import { useState, useMemo, useCallback } from 'react'
import { Team, GroupPositions, Matchup, PredictionState, Step } from '@/types'
import StepNav from '@/components/StepNav'
import GroupStage, { initGroups } from '@/components/GroupStage'
import ThirdPlacedTeams from '@/components/ThirdPlacedTeams'
import RoundOf32Bracket from '@/components/RoundOf32Bracket'
import KnockoutRound from '@/components/KnockoutRound'
import FinalMatch from '@/components/FinalMatch'
import { buildRoundOf32, buildNextRound, getThirdPlacedTeams, isStepComplete } from '@/utils/bracketLogic'

const STEPS: Step[] = ['groups', 'third-placed', 'round-of-32', 'round-of-16', 'quarter-finals', 'semi-finals', 'final', 'result']

function makeEmptyMatches(count: number, prefix: string): Matchup[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    home: null,
    away: null,
    winner: null,
  }))
}

export default function PredictPage() {
  const [step, setStep] = useState<Step>('groups')
  const [state, setState] = useState<PredictionState>(() => ({
    groups: initGroups(),
    selectedThird: [],
    roundOf32: makeEmptyMatches(16, 'r32'),
    roundOf16: makeEmptyMatches(8, 'r16'),
    quarterFinals: makeEmptyMatches(4, 'qf'),
    semiFinals: makeEmptyMatches(2, 'sf'),
    final: { id: 'final', home: null, away: null, winner: null },
    champion: null,
  }))

  const completed = useMemo(() => {
    const c: Record<string, boolean> = {}
    for (const s of STEPS) c[s] = isStepComplete(s, state)
    return c
  }, [state])

  const thirdPlaceTeams = useMemo(() => getThirdPlacedTeams(state.groups), [state.groups])

  function handleStepClick(s: Step) {
    const idx = STEPS.indexOf(s)
    const currentIdx = STEPS.indexOf(step)
    if (idx <= currentIdx || completed[STEPS[idx - 1]]) setStep(s)
  }

  function goNext() {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }

  function goBack() {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  function handleGroupsChange(groups: Record<string, GroupPositions>) {
    setState(prev => {
      const third = getThirdPlacedTeams(groups)
      const selectedThird = prev.selectedThird.filter(n => third.some(t => t.name === n))
      return { ...prev, groups, selectedThird }
    })
  }

  function handleThirdChange(selected: string[]) {
    setState(prev => ({ ...prev, selectedThird: selected }))
  }

  function proceedFromThird() {
    const selectedTeams = thirdPlaceTeams.filter(t => state.selectedThird.includes(t.name))
    const r32 = buildRoundOf32(state.groups, selectedTeams)
    setState(prev => ({ ...prev, roundOf32: r32 }))
    goNext()
  }

  function handleR32Pick(matchId: string, winnerSide: 'home' | 'away') {
    setState(prev => {
      const matches = prev.roundOf32.map(m => {
        if (m.id !== matchId) return m
        const winner = winnerSide === 'home' ? m.home : m.away
        return { ...m, winner }
      })
      const r16 = buildNextRound(matches)
      return { ...prev, roundOf32: matches, roundOf16: r16 }
    })
  }

  function handleR16Pick(matchId: string, winner: Team) {
    setState(prev => {
      const matches = prev.roundOf16.map(m =>
        m.id === matchId ? { ...m, winner } : m
      )
      const qf = buildNextRound(matches)
      return { ...prev, roundOf16: matches, quarterFinals: qf }
    })
  }

  function handleQfPick(matchId: string, winner: Team) {
    setState(prev => {
      const matches = prev.quarterFinals.map(m =>
        m.id === matchId ? { ...m, winner } : m
      )
      const sf = buildNextRound(matches)
      return { ...prev, quarterFinals: matches, semiFinals: sf }
    })
  }

  function handleSfPick(matchId: string, winner: Team) {
    setState(prev => {
      const matches = prev.semiFinals.map(m =>
        m.id === matchId ? { ...m, winner } : m
      )
      const [finalMatch] = buildNextRound(matches)
      return { ...prev, semiFinals: matches, final: finalMatch }
    })
  }

  function handleFinalPick(winner: Team) {
    setState(prev => ({
      ...prev,
      final: { ...prev.final, winner },
      champion: winner,
    }))
  }

  function resetAll() {
    setStep('groups')
    setState({
      groups: initGroups(),
      selectedThird: [],
      roundOf32: makeEmptyMatches(16, 'r32'),
      roundOf16: makeEmptyMatches(8, 'r16'),
      quarterFinals: makeEmptyMatches(4, 'qf'),
      semiFinals: makeEmptyMatches(2, 'sf'),
      final: { id: 'final', home: null, away: null, winner: null },
      champion: null,
    })
  }

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">World Cup 2026 Predictor</h1>
        <p className="text-sm text-slate-400">Step {STEPS.indexOf(step) + 1} of {STEPS.length}</p>
      </div>

      <StepNav currentStep={step} onStep={handleStepClick} completed={completed} />

      <div className="mt-8">
        {step === 'groups' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">Group Stage</h2>
              <p className="text-sm text-slate-400">
                Drag teams within each group to rank them 1st → 4th. Top 2 advance automatically.
                The 8 best third-placed teams are selected in the next step.
              </p>
            </div>
            <GroupStage groups={state.groups} onGroupsChange={handleGroupsChange} />
          </div>
        )}

        {step === 'third-placed' && (
          <ThirdPlacedTeams
            teams={thirdPlaceTeams}
            selected={state.selectedThird}
            onSelectionChange={handleThirdChange}
          />
        )}

        {step === 'round-of-32' && (
          <RoundOf32Bracket matches={state.roundOf32} onPickWinner={handleR32Pick} />
        )}

        {step === 'round-of-16' && (
          <KnockoutRound
            title="Round of 16"
            matches={state.roundOf16}
            onMatchUpdate={handleR16Pick}
          />
        )}

        {step === 'quarter-finals' && (
          <KnockoutRound
            title="Quarter-finals"
            matches={state.quarterFinals}
            onMatchUpdate={handleQfPick}
          />
        )}

        {step === 'semi-finals' && (
          <KnockoutRound
            title="Semi-finals"
            matches={state.semiFinals}
            onMatchUpdate={handleSfPick}
          />
        )}

        {step === 'final' && (
          <FinalMatch match={state.final} onSelectWinner={handleFinalPick} />
        )}

        {step === 'result' && state.champion && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-8xl mb-6 animate-bounce">🏆</span>
            <span className="text-6xl mb-4">{state.champion.flag}</span>
            <h2 className="text-4xl font-bold text-white mb-2">{state.champion.name}</h2>
            <p className="text-xl text-emerald-400 font-semibold mb-8">2026 World Cup Champion</p>
            <div className="text-sm text-slate-500 max-w-md">
              <p className="mb-4">Your complete prediction from group stage to final.</p>
              <button onClick={resetAll} className="text-emerald-400 hover:text-emerald-300 underline">
                Make a new prediction
              </button>
            </div>
          </div>
        )}
      </div>

      {step !== 'result' && (
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={goBack}
            disabled={step === 'groups'}
            className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <div className="flex gap-3">
            {step === 'third-placed' && (
              <button
                onClick={proceedFromThird}
                disabled={!completed['third-placed']}
                className="btn-primary"
              >
                Build Bracket →
              </button>
            )}

            {step === 'final' && completed.final && (
              <button onClick={goNext} className="btn-primary">
                See Result →
              </button>
            )}

            {step !== 'third-placed' && step !== 'final' && (
              <button
                onClick={goNext}
                disabled={!completed[step]}
                className="btn-primary"
              >
                {completed[step] ? 'Next →' : 'Complete this step first'}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
