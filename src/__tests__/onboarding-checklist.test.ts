import { describe, it, expect } from 'vitest'

/**
 * Onboarding checklist logic tests.
 *
 * The OnboardingChecklist is a 'use client' React component that relies on
 * hooks and localStorage, so we cannot render it in a Node environment.
 * Instead we extract and test the pure logic used inside the component:
 *   - completedCount calculation
 *   - progress percentage
 *   - nextStep resolution
 *   - allDone flag
 */

// ── Types (mirrors onboarding-checklist.tsx) ────────────────────────────────

interface OnboardingStep {
  key: string
  title: string
  description: string
  done: boolean
  href?: string
  cta?: string
}

// ── Pure logic extracted from the component ─────────────────────────────────

function computeOnboardingState(steps: OnboardingStep[]) {
  const completedCount = steps.filter((s) => s.done).length
  const allDone = steps.length > 0 && completedCount === steps.length
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0
  const nextStep = steps.find((s) => !s.done) ?? null
  return { completedCount, allDone, progress, nextStep }
}

// ── Fixtures ────────────────────────────────────────────────────────────────

function makeSteps(overrides?: Partial<OnboardingStep>[]): OnboardingStep[] {
  const defaults: OnboardingStep[] = [
    {
      key: 'create-changelog',
      title: 'Create your changelog',
      description: 'Set up your first changelog project',
      done: false,
      href: '/new',
      cta: 'Create changelog',
    },
    {
      key: 'first-entry',
      title: 'Publish your first entry',
      description: 'Write and publish a changelog entry',
      done: false,
      href: '/entries/new',
      cta: 'New entry',
    },
    {
      key: 'custom-domain',
      title: 'Set up a custom domain',
      description: 'Point your own domain to your changelog',
      done: false,
    },
    {
      key: 'api-key',
      title: 'Generate an API key',
      description: 'Automate entries via the API',
      done: false,
      href: '/settings/api',
      cta: 'API settings',
    },
  ]
  if (!overrides) return defaults
  return defaults.map((step, i) => ({ ...step, ...(overrides[i] ?? {}) }))
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('Onboarding checklist logic', () => {
  describe('completedCount', () => {
    it('is 0 when no steps are done', () => {
      const { completedCount } = computeOnboardingState(makeSteps())
      expect(completedCount).toBe(0)
    })

    it('counts only done steps', () => {
      const steps = makeSteps([{ done: true }, {}, { done: true }, {}])
      const { completedCount } = computeOnboardingState(steps)
      expect(completedCount).toBe(2)
    })

    it('equals total when all steps are done', () => {
      const steps = makeSteps([{ done: true }, { done: true }, { done: true }, { done: true }])
      const { completedCount } = computeOnboardingState(steps)
      expect(completedCount).toBe(4)
    })
  })

  describe('progress percentage', () => {
    it('is 0 when no steps are done', () => {
      const { progress } = computeOnboardingState(makeSteps())
      expect(progress).toBe(0)
    })

    it('is 100 when all steps are done', () => {
      const steps = makeSteps([{ done: true }, { done: true }, { done: true }, { done: true }])
      const { progress } = computeOnboardingState(steps)
      expect(progress).toBe(100)
    })

    it('is 50 when half the steps are done', () => {
      const steps = makeSteps([{ done: true }, { done: true }, {}, {}])
      const { progress } = computeOnboardingState(steps)
      expect(progress).toBe(50)
    })

    it('rounds to nearest integer', () => {
      // 1 of 3 = 33.33... -> 33
      const steps: OnboardingStep[] = [
        { key: 'a', title: 'A', description: '', done: true },
        { key: 'b', title: 'B', description: '', done: false },
        { key: 'c', title: 'C', description: '', done: false },
      ]
      const { progress } = computeOnboardingState(steps)
      expect(progress).toBe(33)
    })

    it('rounds 2 of 3 to 67', () => {
      const steps: OnboardingStep[] = [
        { key: 'a', title: 'A', description: '', done: true },
        { key: 'b', title: 'B', description: '', done: true },
        { key: 'c', title: 'C', description: '', done: false },
      ]
      const { progress } = computeOnboardingState(steps)
      expect(progress).toBe(67)
    })
  })

  describe('nextStep', () => {
    it('is the first undone step', () => {
      const steps = makeSteps([{ done: true }, {}, {}, {}])
      const { nextStep } = computeOnboardingState(steps)
      expect(nextStep).not.toBeNull()
      expect(nextStep!.key).toBe('first-entry')
    })

    it('is the very first step when none are done', () => {
      const { nextStep } = computeOnboardingState(makeSteps())
      expect(nextStep).not.toBeNull()
      expect(nextStep!.key).toBe('create-changelog')
    })

    it('is null when all steps are done', () => {
      const steps = makeSteps([{ done: true }, { done: true }, { done: true }, { done: true }])
      const { nextStep } = computeOnboardingState(steps)
      expect(nextStep).toBeNull()
    })

    it('skips done steps in the middle', () => {
      const steps = makeSteps([{ done: true }, { done: true }, {}, { done: true }])
      const { nextStep } = computeOnboardingState(steps)
      expect(nextStep).not.toBeNull()
      expect(nextStep!.key).toBe('custom-domain')
    })
  })

  describe('allDone', () => {
    it('is false when some steps remain', () => {
      const steps = makeSteps([{ done: true }, { done: true }, {}, {}])
      const { allDone } = computeOnboardingState(steps)
      expect(allDone).toBe(false)
    })

    it('is true when every step is done', () => {
      const steps = makeSteps([{ done: true }, { done: true }, { done: true }, { done: true }])
      const { allDone } = computeOnboardingState(steps)
      expect(allDone).toBe(true)
    })

    it('is false when no steps are done', () => {
      const { allDone } = computeOnboardingState(makeSteps())
      expect(allDone).toBe(false)
    })
  })

  describe('edge case: empty steps array', () => {
    it('has completedCount 0', () => {
      const { completedCount } = computeOnboardingState([])
      expect(completedCount).toBe(0)
    })

    it('has progress 0 (no division by zero)', () => {
      const { progress } = computeOnboardingState([])
      expect(progress).toBe(0)
    })

    it('has nextStep null', () => {
      const { nextStep } = computeOnboardingState([])
      expect(nextStep).toBeNull()
    })

    it('has allDone false', () => {
      // An empty checklist is not "all done" -- there is nothing to complete
      const { allDone } = computeOnboardingState([])
      expect(allDone).toBe(false)
    })
  })

  describe('edge case: single step', () => {
    it('reports 100% when the only step is done', () => {
      const steps: OnboardingStep[] = [
        { key: 'only', title: 'Only step', description: 'The one step', done: true },
      ]
      const state = computeOnboardingState(steps)
      expect(state.completedCount).toBe(1)
      expect(state.progress).toBe(100)
      expect(state.allDone).toBe(true)
      expect(state.nextStep).toBeNull()
    })

    it('reports 0% when the only step is not done', () => {
      const steps: OnboardingStep[] = [
        { key: 'only', title: 'Only step', description: 'The one step', done: false },
      ]
      const state = computeOnboardingState(steps)
      expect(state.completedCount).toBe(0)
      expect(state.progress).toBe(0)
      expect(state.allDone).toBe(false)
      expect(state.nextStep).not.toBeNull()
      expect(state.nextStep!.key).toBe('only')
    })
  })

  describe('OnboardingStep interface shape', () => {
    it('accepts steps with optional href and cta', () => {
      const step: OnboardingStep = {
        key: 'test',
        title: 'Test step',
        description: 'A test',
        done: false,
      }
      // No href or cta -- should still work
      const { nextStep } = computeOnboardingState([step])
      expect(nextStep).toEqual(step)
    })

    it('preserves href and cta on steps that have them', () => {
      const step: OnboardingStep = {
        key: 'test',
        title: 'Test step',
        description: 'A test',
        done: false,
        href: '/go',
        cta: 'Go now',
      }
      const { nextStep } = computeOnboardingState([step])
      expect(nextStep!.href).toBe('/go')
      expect(nextStep!.cta).toBe('Go now')
    })
  })
})
