'use client'

import { Step, ROUND_LABELS } from '@/types'

const STEPS: Step[] = ['groups', 'third-placed', 'round-of-32', 'round-of-16', 'quarter-finals', 'semi-finals', 'final', 'result']

interface StepNavProps {
  currentStep: Step
  onStep: (step: Step) => void
  completed: Record<string, boolean>
}

export default function StepNav({ currentStep, onStep, completed }: StepNavProps) {
  const currentIdx = STEPS.indexOf(currentStep)

  return (
    <nav className="flex items-center gap-0.5 overflow-x-auto pb-2">
      {STEPS.map((step, i) => {
        const isComplete = completed[step]
        const isActive = step === currentStep
        const isPast = currentIdx > i

        return (
          <button
            key={step}
            onClick={() => onStep(step)}
            disabled={!isComplete && !isActive && !isPast}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap
              ${isActive ? 'bg-emerald-600 text-white' : ''}
              ${isComplete && !isActive ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/50' : ''}
              ${!isComplete && !isActive ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed' : ''}
              ${isPast && !isComplete ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700' : ''}
            `}
          >
            {isComplete && <span className="text-emerald-400">✓</span>}
            {i + 1}. {ROUND_LABELS[step]}
          </button>
        )
      })}
    </nav>
  )
}
