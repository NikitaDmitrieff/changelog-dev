import { describe, it, expect } from 'vitest'

// Pure logic tests for entry sorting (mirrors EntryList component logic)

type SortOption = 'newest' | 'oldest' | 'most-viewed' | 'least-viewed' | 'title-az' | 'title-za'

interface TestEntry {
  id: string
  title: string
  created_at: string
  view_count: number
}

function sortEntries(entries: TestEntry[], sort: SortOption): TestEntry[] {
  return [...entries].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'most-viewed':
        return b.view_count - a.view_count
      case 'least-viewed':
        return a.view_count - b.view_count
      case 'title-az':
        return a.title.localeCompare(b.title)
      case 'title-za':
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })
}

const entries: TestEntry[] = [
  { id: '1', title: 'Beta release', created_at: '2026-01-15T10:00:00Z', view_count: 50 },
  { id: '2', title: 'Alpha launch', created_at: '2026-03-01T12:00:00Z', view_count: 200 },
  { id: '3', title: 'Dark mode', created_at: '2026-02-10T08:00:00Z', view_count: 0 },
  { id: '4', title: 'CSS fixes', created_at: '2026-02-20T14:00:00Z', view_count: 75 },
]

describe('Entry sorting', () => {
  describe('sort by date', () => {
    it('newest first (default)', () => {
      const result = sortEntries(entries, 'newest')
      expect(result.map((e) => e.id)).toEqual(['2', '4', '3', '1'])
    })

    it('oldest first', () => {
      const result = sortEntries(entries, 'oldest')
      expect(result.map((e) => e.id)).toEqual(['1', '3', '4', '2'])
    })
  })

  describe('sort by views', () => {
    it('most viewed first', () => {
      const result = sortEntries(entries, 'most-viewed')
      expect(result.map((e) => e.id)).toEqual(['2', '4', '1', '3'])
    })

    it('least viewed first', () => {
      const result = sortEntries(entries, 'least-viewed')
      expect(result.map((e) => e.id)).toEqual(['3', '1', '4', '2'])
    })
  })

  describe('sort by title', () => {
    it('A-Z', () => {
      const result = sortEntries(entries, 'title-az')
      expect(result.map((e) => e.id)).toEqual(['2', '1', '4', '3'])
    })

    it('Z-A', () => {
      const result = sortEntries(entries, 'title-za')
      expect(result.map((e) => e.id)).toEqual(['3', '4', '1', '2'])
    })
  })

  describe('edge cases', () => {
    it('empty array returns empty', () => {
      expect(sortEntries([], 'newest')).toEqual([])
    })

    it('single entry returns itself', () => {
      const single = [entries[0]]
      expect(sortEntries(single, 'newest')).toEqual(single)
    })

    it('does not mutate original array', () => {
      const original = [...entries]
      sortEntries(entries, 'title-az')
      expect(entries.map((e) => e.id)).toEqual(original.map((e) => e.id))
    })

    it('entries with same view count maintain relative order', () => {
      const tied = [
        { id: 'a', title: 'A', created_at: '2026-01-01T00:00:00Z', view_count: 10 },
        { id: 'b', title: 'B', created_at: '2026-01-02T00:00:00Z', view_count: 10 },
      ]
      const result = sortEntries(tied, 'most-viewed')
      // Same view_count, sort is stable so order preserved
      expect(result.map((e) => e.id)).toEqual(['a', 'b'])
    })

    it('entries with same date maintain relative order', () => {
      const tied = [
        { id: 'a', title: 'A', created_at: '2026-01-01T00:00:00Z', view_count: 5 },
        { id: 'b', title: 'B', created_at: '2026-01-01T00:00:00Z', view_count: 10 },
      ]
      const result = sortEntries(tied, 'newest')
      expect(result.map((e) => e.id)).toEqual(['a', 'b'])
    })

    it('case-insensitive title sorting', () => {
      const mixed = [
        { id: 'a', title: 'banana', created_at: '2026-01-01T00:00:00Z', view_count: 0 },
        { id: 'b', title: 'Apple', created_at: '2026-01-01T00:00:00Z', view_count: 0 },
      ]
      const result = sortEntries(mixed, 'title-az')
      // localeCompare is case-insensitive by default
      expect(result.map((e) => e.id)).toEqual(['b', 'a'])
    })
  })
})
