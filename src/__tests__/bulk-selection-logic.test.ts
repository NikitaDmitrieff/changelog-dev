import { describe, it, expect } from 'vitest'

// Pure logic tests for bulk selection behavior

function toggleSelect(selectedIds: Set<string>, entryId: string): Set<string> {
  const next = new Set(selectedIds)
  if (next.has(entryId)) {
    next.delete(entryId)
  } else {
    next.add(entryId)
  }
  return next
}

function toggleSelectAll(selectedIds: Set<string>, visibleIds: string[]): Set<string> {
  const allSelected = visibleIds.every((id) => selectedIds.has(id))
  const next = new Set(selectedIds)
  if (allSelected) {
    visibleIds.forEach((id) => next.delete(id))
  } else {
    visibleIds.forEach((id) => next.add(id))
  }
  return next
}

type FilterType = 'all' | 'published' | 'draft'

function filterEntries(
  entries: { id: string; is_published: boolean }[],
  filter: FilterType
): { id: string; is_published: boolean }[] {
  if (filter === 'published') return entries.filter((e) => e.is_published)
  if (filter === 'draft') return entries.filter((e) => !e.is_published)
  return entries
}

function applyBulkPublish(
  entries: { id: string; is_published: boolean; published_at: string | null; scheduled_for: string | null }[],
  selectedIds: Set<string>
) {
  return entries.map((e) =>
    selectedIds.has(e.id)
      ? { ...e, is_published: true, published_at: '2026-01-01T00:00:00Z', scheduled_for: null }
      : e
  )
}

function applyBulkUnpublish(
  entries: { id: string; is_published: boolean; published_at: string | null }[],
  selectedIds: Set<string>
) {
  return entries.map((e) =>
    selectedIds.has(e.id) ? { ...e, is_published: false, published_at: null } : e
  )
}

function applyBulkDelete(
  entries: { id: string }[],
  selectedIds: Set<string>
) {
  return entries.filter((e) => !selectedIds.has(e.id))
}

describe('Bulk selection logic', () => {
  describe('toggleSelect', () => {
    it('adds an unselected entry', () => {
      const result = toggleSelect(new Set(), 'e1')
      expect(result.has('e1')).toBe(true)
      expect(result.size).toBe(1)
    })

    it('removes a selected entry', () => {
      const result = toggleSelect(new Set(['e1', 'e2']), 'e1')
      expect(result.has('e1')).toBe(false)
      expect(result.has('e2')).toBe(true)
    })

    it('does not mutate the original set', () => {
      const original = new Set(['e1'])
      toggleSelect(original, 'e2')
      expect(original.size).toBe(1)
    })
  })

  describe('toggleSelectAll', () => {
    it('selects all visible when none selected', () => {
      const result = toggleSelectAll(new Set(), ['e1', 'e2', 'e3'])
      expect(result.size).toBe(3)
    })

    it('deselects all visible when all selected', () => {
      const result = toggleSelectAll(new Set(['e1', 'e2', 'e3']), ['e1', 'e2', 'e3'])
      expect(result.size).toBe(0)
    })

    it('selects remaining when partially selected', () => {
      const result = toggleSelectAll(new Set(['e1']), ['e1', 'e2', 'e3'])
      expect(result.size).toBe(3)
    })

    it('preserves selections outside visible set', () => {
      const result = toggleSelectAll(new Set(['e1', 'hidden']), ['e1', 'e2'])
      // All visible selected -> deselect visible, keep hidden
      expect(result.has('hidden')).toBe(true)
      // Wait, e1 and e2 are visible, but only e1 is selected -> not all selected -> select all
      // Actually: visibleIds = ['e1', 'e2'], allSelected = e1 yes, e2 no -> false -> select all
      expect(result.has('e1')).toBe(true)
      expect(result.has('e2')).toBe(true)
      expect(result.has('hidden')).toBe(true)
      expect(result.size).toBe(3)
    })

    it('deselects all visible but keeps non-visible selections', () => {
      const result = toggleSelectAll(new Set(['e1', 'e2', 'hidden']), ['e1', 'e2'])
      // All visible (e1, e2) selected -> deselect them, keep hidden
      expect(result.has('e1')).toBe(false)
      expect(result.has('e2')).toBe(false)
      expect(result.has('hidden')).toBe(true)
      expect(result.size).toBe(1)
    })

    it('handles empty visible list', () => {
      const result = toggleSelectAll(new Set(['e1']), [])
      // All 0 visible are "selected" (vacuous truth) -> deselect (nothing to deselect)
      expect(result.size).toBe(1)
    })
  })

  describe('filterEntries', () => {
    const entries = [
      { id: 'e1', is_published: true },
      { id: 'e2', is_published: false },
      { id: 'e3', is_published: true },
    ]

    it('returns all entries for "all" filter', () => {
      expect(filterEntries(entries, 'all')).toHaveLength(3)
    })

    it('returns only published for "published" filter', () => {
      const result = filterEntries(entries, 'published')
      expect(result).toHaveLength(2)
      expect(result.every((e) => e.is_published)).toBe(true)
    })

    it('returns only drafts for "draft" filter', () => {
      const result = filterEntries(entries, 'draft')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('e2')
    })
  })

  describe('applyBulkPublish', () => {
    it('publishes selected entries and clears scheduled_for', () => {
      const entries = [
        { id: 'e1', is_published: false, published_at: null, scheduled_for: '2026-05-01T00:00:00Z' },
        { id: 'e2', is_published: false, published_at: null, scheduled_for: null },
        { id: 'e3', is_published: true, published_at: '2026-01-01T00:00:00Z', scheduled_for: null },
      ]
      const result = applyBulkPublish(entries, new Set(['e1', 'e2']))
      expect(result[0].is_published).toBe(true)
      expect(result[0].scheduled_for).toBeNull()
      expect(result[1].is_published).toBe(true)
      expect(result[2].is_published).toBe(true) // unchanged
    })

    it('does not modify unselected entries', () => {
      const entries = [
        { id: 'e1', is_published: false, published_at: null, scheduled_for: null },
      ]
      const result = applyBulkPublish(entries, new Set(['e2']))
      expect(result[0].is_published).toBe(false)
    })
  })

  describe('applyBulkUnpublish', () => {
    it('unpublishes selected entries', () => {
      const entries = [
        { id: 'e1', is_published: true, published_at: '2026-01-01T00:00:00Z' },
        { id: 'e2', is_published: true, published_at: '2026-01-02T00:00:00Z' },
      ]
      const result = applyBulkUnpublish(entries, new Set(['e1']))
      expect(result[0].is_published).toBe(false)
      expect(result[0].published_at).toBeNull()
      expect(result[1].is_published).toBe(true)
    })
  })

  describe('applyBulkDelete', () => {
    it('removes selected entries', () => {
      const entries = [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }]
      const result = applyBulkDelete(entries, new Set(['e1', 'e3']))
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('e2')
    })

    it('returns all entries when none selected', () => {
      const entries = [{ id: 'e1' }, { id: 'e2' }]
      const result = applyBulkDelete(entries, new Set())
      expect(result).toHaveLength(2)
    })
  })
})
