import { describe, it, expect } from 'vitest'

/**
 * Keyboard shortcuts logic tests.
 *
 * The KeyboardShortcuts component is a 'use client' React component that
 * relies on hooks (useRouter, useParams, useEffect). We test the pure logic:
 *   - isEditableTarget detection
 *   - shortcut key mapping
 *   - chord sequence validation
 */

// ── Pure logic extracted from the component ─────────────────────────────────

function isEditableTarget(tagName: string, isContentEditable: boolean): boolean {
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') return true
  if (isContentEditable) return true
  return false
}

interface ShortcutRoute {
  key: string
  changelogId?: string
}

function resolveNewEntryRoute(changelogId?: string): string {
  return changelogId ? `/dashboard/${changelogId}/new-entry` : '/dashboard/new'
}

function resolveChordRoute(
  chord: string,
  followKey: string,
  changelogId?: string
): string | null {
  if (chord !== 'g') return null
  if (followKey === 'h') return '/dashboard'
  if (followKey === 's' && changelogId) return `/dashboard/${changelogId}/settings`
  return null
}

function shouldIgnoreKey(e: { metaKey: boolean; ctrlKey: boolean; altKey: boolean }): boolean {
  return e.metaKey || e.ctrlKey || e.altKey
}

const SHORTCUT_KEYS = ['n', '/', '?', 'g'] as const

function isShortcutKey(key: string): boolean {
  return (SHORTCUT_KEYS as readonly string[]).includes(key)
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('isEditableTarget', () => {
  it('returns true for INPUT', () => {
    expect(isEditableTarget('INPUT', false)).toBe(true)
  })

  it('returns true for TEXTAREA', () => {
    expect(isEditableTarget('TEXTAREA', false)).toBe(true)
  })

  it('returns true for SELECT', () => {
    expect(isEditableTarget('SELECT', false)).toBe(true)
  })

  it('returns true for contentEditable', () => {
    expect(isEditableTarget('DIV', true)).toBe(true)
  })

  it('returns false for regular DIV', () => {
    expect(isEditableTarget('DIV', false)).toBe(false)
  })

  it('returns false for BUTTON', () => {
    expect(isEditableTarget('BUTTON', false)).toBe(false)
  })
})

describe('resolveNewEntryRoute', () => {
  it('routes to changelog new-entry when id is present', () => {
    expect(resolveNewEntryRoute('abc-123')).toBe('/dashboard/abc-123/new-entry')
  })

  it('routes to dashboard new when no id', () => {
    expect(resolveNewEntryRoute()).toBe('/dashboard/new')
  })
})

describe('resolveChordRoute', () => {
  it('g then h navigates to dashboard', () => {
    expect(resolveChordRoute('g', 'h')).toBe('/dashboard')
  })

  it('g then s navigates to settings with id', () => {
    expect(resolveChordRoute('g', 's', 'abc-123')).toBe('/dashboard/abc-123/settings')
  })

  it('g then s returns null without id', () => {
    expect(resolveChordRoute('g', 's')).toBe(null)
  })

  it('g then unknown key returns null', () => {
    expect(resolveChordRoute('g', 'x')).toBe(null)
  })

  it('non-g chord returns null', () => {
    expect(resolveChordRoute('x', 'h')).toBe(null)
  })
})

describe('shouldIgnoreKey', () => {
  it('ignores meta key', () => {
    expect(shouldIgnoreKey({ metaKey: true, ctrlKey: false, altKey: false })).toBe(true)
  })

  it('ignores ctrl key', () => {
    expect(shouldIgnoreKey({ metaKey: false, ctrlKey: true, altKey: false })).toBe(true)
  })

  it('ignores alt key', () => {
    expect(shouldIgnoreKey({ metaKey: false, ctrlKey: false, altKey: true })).toBe(true)
  })

  it('does not ignore plain key', () => {
    expect(shouldIgnoreKey({ metaKey: false, ctrlKey: false, altKey: false })).toBe(false)
  })
})

describe('isShortcutKey', () => {
  it('recognizes n', () => expect(isShortcutKey('n')).toBe(true))
  it('recognizes /', () => expect(isShortcutKey('/')).toBe(true))
  it('recognizes ?', () => expect(isShortcutKey('?')).toBe(true))
  it('recognizes g', () => expect(isShortcutKey('g')).toBe(true))
  it('rejects x', () => expect(isShortcutKey('x')).toBe(false))
  it('rejects empty', () => expect(isShortcutKey('')).toBe(false))
})
