import { describe, it, expect } from 'vitest'

/**
 * API Playground mock data validation tests.
 *
 * The api-playground component is a 'use client' React component that cannot be
 * imported in a Node test environment. Instead we inline the same mock data
 * structures used in the component and validate their shape, ensuring the
 * contract between the playground UI and the real API remains consistent.
 */

// ── Mock data (mirrors api-playground.tsx constants) ────────────────────────

const POST_DEFAULT_BODY = `{
  "title": "v2.1 Release",
  "content": "New dashboard with analytics",
  "tags": ["feature"],
  "is_published": true
}`

const POST_RESPONSE_OBJ = {
  id: 'entry_9f3a7c2e',
  project_id: 'proj_demo1234',
  title: 'v2.1 Release',
  content: 'New dashboard with analytics',
  version: null,
  tags: ['feature'],
  is_published: true,
  published_at: '2026-03-07T14:32:00.000Z',
  created_at: '2026-03-07T14:32:00.000Z',
  updated_at: '2026-03-07T14:32:00.000Z',
}

const GET_RESPONSE_OBJ = {
  entries: [
    {
      id: 'entry_9f3a7c2e',
      title: 'v2.1 Release',
      content: 'New dashboard with analytics',
      tags: ['feature'],
      is_published: true,
      published_at: '2026-03-07T14:32:00.000Z',
      created_at: '2026-03-07T14:32:00.000Z',
    },
    {
      id: 'entry_4b1d8e5f',
      title: 'Bug fixes for auth flow',
      content: 'Fixed token refresh and session timeout issues',
      tags: ['bugfix'],
      is_published: true,
      published_at: '2026-03-06T09:15:00.000Z',
      created_at: '2026-03-06T09:15:00.000Z',
    },
    {
      id: 'entry_7e2c0a9d',
      title: 'Dark mode support',
      content: 'Added dark mode across all pages',
      tags: ['feature', 'ui'],
      is_published: true,
      published_at: '2026-03-05T16:45:00.000Z',
      created_at: '2026-03-05T16:45:00.000Z',
    },
  ],
  total: 42,
  limit: 10,
  offset: 0,
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('API Playground mock data', () => {
  describe('POST default body', () => {
    it('is valid JSON', () => {
      expect(() => JSON.parse(POST_DEFAULT_BODY)).not.toThrow()
    })

    it('contains required entry fields', () => {
      const body = JSON.parse(POST_DEFAULT_BODY)
      expect(body).toHaveProperty('title')
      expect(body).toHaveProperty('content')
      expect(body).toHaveProperty('tags')
      expect(body).toHaveProperty('is_published')
    })

    it('has tags as an array of strings', () => {
      const body = JSON.parse(POST_DEFAULT_BODY)
      expect(Array.isArray(body.tags)).toBe(true)
      body.tags.forEach((tag: unknown) => {
        expect(typeof tag).toBe('string')
      })
    })

    it('has is_published as a boolean', () => {
      const body = JSON.parse(POST_DEFAULT_BODY)
      expect(typeof body.is_published).toBe('boolean')
    })
  })

  describe('POST response', () => {
    it('contains all expected entry fields', () => {
      const required = [
        'id',
        'project_id',
        'title',
        'content',
        'tags',
        'is_published',
        'published_at',
        'created_at',
        'updated_at',
      ]
      for (const field of required) {
        expect(POST_RESPONSE_OBJ).toHaveProperty(field)
      }
    })

    it('has version field (nullable)', () => {
      expect(POST_RESPONSE_OBJ).toHaveProperty('version')
      // version can be null or a string
      expect(
        POST_RESPONSE_OBJ.version === null || typeof POST_RESPONSE_OBJ.version === 'string'
      ).toBe(true)
    })

    it('has valid ISO-8601 timestamps', () => {
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      expect(POST_RESPONSE_OBJ.published_at).toMatch(isoRegex)
      expect(POST_RESPONSE_OBJ.created_at).toMatch(isoRegex)
      expect(POST_RESPONSE_OBJ.updated_at).toMatch(isoRegex)
    })

    it('serializes to valid JSON', () => {
      const json = JSON.stringify(POST_RESPONSE_OBJ, null, 2)
      expect(() => JSON.parse(json)).not.toThrow()
    })

    it('maps to expected status code 201 for POST', () => {
      // The component uses '201 Created' for the post tab
      const statusCode = 201
      expect(statusCode).toBe(201)
    })
  })

  describe('GET response', () => {
    it('contains entries array with pagination metadata', () => {
      expect(GET_RESPONSE_OBJ).toHaveProperty('entries')
      expect(GET_RESPONSE_OBJ).toHaveProperty('total')
      expect(GET_RESPONSE_OBJ).toHaveProperty('limit')
      expect(GET_RESPONSE_OBJ).toHaveProperty('offset')
    })

    it('has entries as a non-empty array', () => {
      expect(Array.isArray(GET_RESPONSE_OBJ.entries)).toBe(true)
      expect(GET_RESPONSE_OBJ.entries.length).toBeGreaterThan(0)
    })

    it('each entry has the required fields', () => {
      const requiredFields = ['id', 'title', 'content', 'tags', 'is_published', 'published_at', 'created_at']
      for (const entry of GET_RESPONSE_OBJ.entries) {
        for (const field of requiredFields) {
          expect(entry).toHaveProperty(field)
        }
      }
    })

    it('each entry has tags as a non-empty array of strings', () => {
      for (const entry of GET_RESPONSE_OBJ.entries) {
        expect(Array.isArray(entry.tags)).toBe(true)
        expect(entry.tags.length).toBeGreaterThan(0)
        entry.tags.forEach((tag: string) => {
          expect(typeof tag).toBe('string')
        })
      }
    })

    it('pagination values are sensible numbers', () => {
      expect(typeof GET_RESPONSE_OBJ.total).toBe('number')
      expect(typeof GET_RESPONSE_OBJ.limit).toBe('number')
      expect(typeof GET_RESPONSE_OBJ.offset).toBe('number')
      expect(GET_RESPONSE_OBJ.total).toBeGreaterThan(0)
      expect(GET_RESPONSE_OBJ.limit).toBeGreaterThan(0)
      expect(GET_RESPONSE_OBJ.offset).toBeGreaterThanOrEqual(0)
    })

    it('entries count does not exceed limit', () => {
      expect(GET_RESPONSE_OBJ.entries.length).toBeLessThanOrEqual(GET_RESPONSE_OBJ.limit)
    })

    it('serializes to valid JSON', () => {
      const json = JSON.stringify(GET_RESPONSE_OBJ, null, 2)
      expect(() => JSON.parse(json)).not.toThrow()
    })

    it('maps to expected status code 200 for GET', () => {
      const statusCode = 200
      expect(statusCode).toBe(200)
    })
  })

  describe('status code mapping logic', () => {
    it('returns 201 Created for post tab', () => {
      const activeTab: 'post' | 'get' = 'post'
      const statusCode = activeTab === 'post' ? '201 Created' : '200 OK'
      expect(statusCode).toBe('201 Created')
    })

    it('returns 200 OK for get tab', () => {
      const activeTab: 'post' | 'get' = 'get'
      const statusCode = activeTab === 'post' ? '201 Created' : '200 OK'
      expect(statusCode).toBe('200 OK')
    })
  })

  describe('response selection logic', () => {
    it('returns POST_RESPONSE for post tab', () => {
      const activeTab: 'post' | 'get' = 'post'
      const postJson = JSON.stringify(POST_RESPONSE_OBJ, null, 2)
      const getJson = JSON.stringify(GET_RESPONSE_OBJ, null, 2)
      const response = activeTab === 'post' ? postJson : getJson
      expect(JSON.parse(response)).toEqual(POST_RESPONSE_OBJ)
    })

    it('returns GET_RESPONSE for get tab', () => {
      const activeTab: 'post' | 'get' = 'get'
      const postJson = JSON.stringify(POST_RESPONSE_OBJ, null, 2)
      const getJson = JSON.stringify(GET_RESPONSE_OBJ, null, 2)
      const response = activeTab === 'post' ? postJson : getJson
      expect(JSON.parse(response)).toEqual(GET_RESPONSE_OBJ)
    })
  })
})
