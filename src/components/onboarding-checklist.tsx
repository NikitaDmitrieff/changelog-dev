'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export interface OnboardingStep {
  key: string
  title: string
  description: string
  done: boolean
  href?: string
  cta?: string
}

interface Props {
  steps: OnboardingStep[]
  changelogId?: string
}

const DISMISS_KEY = 'changelog-dev-onboarding-dismissed'

export function OnboardingChecklist({ steps, changelogId }: Props) {
  const [dismissed, setDismissed] = useState(true) // default hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === '1')
  }, [])

  const completedCount = steps.filter((s) => s.done).length
  const allDone = completedCount === steps.length

  if (dismissed || allDone) return null

  const progress = Math.round((completedCount / steps.length) * 100)
  const nextStep = steps.find((s) => !s.done)

  return (
    <div className="mb-8 glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
            <svg className="w-4 h-4 text-indigo-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Get started</div>
            <div className="text-xs text-zinc-500">{completedCount} of {steps.length} complete</div>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, '1')
            setDismissed(true)
          }}
          className="text-zinc-600 hover:text-zinc-400 transition-colors"
          aria-label="Dismiss checklist"
        >
          <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1.5 bg-white/[0.06] rounded-full mb-5"
        role="progressbar"
        aria-valuenow={completedCount}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-label={`Onboarding progress: ${completedCount} of ${steps.length} steps complete`}
      >
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.key}
            className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
              !step.done && step.key === nextStep?.key ? 'bg-white/[0.03]' : ''
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {step.done ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/20" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${step.done ? 'text-zinc-500 line-through' : 'text-white'}`}>
                {step.title}
              </div>
              {!step.done && (
                <div className="text-xs text-zinc-500 mt-0.5">{step.description}</div>
              )}
              {!step.done && step.href && step.cta && step.key === nextStep?.key && (
                <Link
                  href={step.href}
                  className="inline-block mt-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                >
                  {step.cta}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
