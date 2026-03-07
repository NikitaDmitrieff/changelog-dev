import { describe, it, expect } from 'vitest'

// Pure logic tests for entry search filtering (mirrors EntryList component logic)

type FilterType = 'all' | 'published' | 'draft'

interface TestEntry {
  id: string
  title: string
  version: string | null
  tags: string[] | null
  is_published: boolean
}

function filterEntries(
  entries: TestEntry[],
  filter: FilterType,
  search: string
): TestEntry[] {
  const searchLower = search.toLowerCase().trim()

  return entries.filter((entry) => {
    if (filter === 'published' && !entry.is_published) return false
    if (filter === 'draft' && entry.is_published) return false

    if (searchLower) {
      const titleMatch = entry.title.toLowerCase().includes(searchLower)
      const versionMatch = entry.version?.toLowerCase().includes(searchLower) ?? false
      const tagMatch = entry.tags?.some((t) => t.toLowerCase().includes(searchLower)) ?? false
      if (!titleMatch && !versionMatch && !tagMatch) return false
    }

    return true
  })
}

const entries: TestEntry[] = [
  { id: '1', title: 'Add dark mode', version: 'v1.2.0', tags: ['feature', 'ui'], is_published: true },
  { id: '2', title: 'Fix login bug', version: 'v1.1.1', tags: ['bugfix'], is_published: true },
  { id: '3', title: 'Redesign dashboard', version: null, tags: ['feature', 'design'], is_published: false },
  { id: '4', title: 'Performance improvements', version: 'v2.0.0-beta', tags: null, is_published: false },
  { id: '5', title: 'API rate limiting', version: 'v1.3.0', tags: ['api', 'security'], is_published: true },
]

describe('Entry search filtering', () => {
  describe('search by title', () => {
    it('matches partial title', () => {
      const result = filterEntries(entries, 'all', 'dark')
      expect(result.map((e) => e.id)).toEqual(['1'])
    })

    it('is case-insensitive', () => {
      const result = filterEntries(entries, 'all', 'FIX LOGIN')
      expect(result.map((e) => e.id)).toEqual(['2'])
    })

    it('matches multiple entries', () => {
      const result = filterEntries(entries, 'all', 'a')
      // "Add dark mode", "Redesign dashboard", "Performance improvements", "API rate limiting" all contain 'a'
      expect(result.map((e) => e.id)).toEqual(['1', '3', '4', '5'])
    })
  })

  describe('search by version', () => {
    it('matches version string', () => {
      const result = filterEntries(entries, 'all', 'v1.2')
      expect(result.map((e) => e.id)).toEqual(['1'])
    })

    it('matches beta version', () => {
      const result = filterEntries(entries, 'all', 'beta')
      expect(result.map((e) => e.id)).toEqual(['4'])
    })

    it('skips entries with null version', () => {
      const result = filterEntries(entries, 'all', 'v1')
      // entries 1, 2, 5 have v1.x versions; entry 3 has null version
      expect(result.map((e) => e.id)).toEqual(['1', '2', '5'])
    })
  })

  describe('search by tag', () => {
    it('matches a tag', () => {
      const result = filterEntries(entries, 'all', 'bugfix')
      expect(result.map((e) => e.id)).toEqual(['2'])
    })

    it('matches partial tag', () => {
      const result = filterEntries(entries, 'all', 'sec')
      expect(result.map((e) => e.id)).toEqual(['5'])
    })

    it('skips entries with null tags', () => {
      const result = filterEntries(entries, 'all', 'feature')
      expect(result.map((e) => e.id)).toEqual(['1', '3'])
    })
  })

  describe('search combined with status filter', () => {
    it('search + published filter', () => {
      const result = filterEntries(entries, 'published', 'feature')
      // Only entry 1 is published and has 'feature' tag
      expect(result.map((e) => e.id)).toEqual(['1'])
    })

    it('search + draft filter', () => {
      const result = filterEntries(entries, 'draft', 'feature')
      // Only entry 3 is draft and has 'feature' tag
      expect(result.map((e) => e.id)).toEqual(['3'])
    })

    it('search with no matches in filtered set', () => {
      const result = filterEntries(entries, 'draft', 'bugfix')
      // Entry 2 has 'bugfix' but is published, not draft
      expect(result).toEqual([])
    })
  })

  describe('edge cases', () => {
    it('empty search returns all entries for filter', () => {
      const result = filterEntries(entries, 'all', '')
      expect(result).toHaveLength(5)
    })

    it('whitespace-only search returns all entries', () => {
      const result = filterEntries(entries, 'all', '   ')
      expect(result).toHaveLength(5)
    })

    it('no matches returns empty array', () => {
      const result = filterEntries(entries, 'all', 'zzzznotfound')
      expect(result).toEqual([])
    })

    it('search matches across title, version, and tag simultaneously', () => {
      // 'api' matches entry 5 by title ("API rate limiting") and by tag ("api")
      const result = filterEntries(entries, 'all', 'api')
      expect(result.map((e) => e.id)).toEqual(['5'])
    })

    it('search trims whitespace', () => {
      const result = filterEntries(entries, 'all', '  dark  ')
      expect(result.map((e) => e.id)).toEqual(['1'])
    })
  })
})
