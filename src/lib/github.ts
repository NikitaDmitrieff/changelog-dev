export interface Commit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

/**
 * Normalize a GitHub repo string to "owner/repo" format.
 * Handles full URLs, .git suffixes, and extra path segments.
 */
function normalizeRepo(repo: string): string {
  let normalized = repo
    .replace(/^https?:\/\/(www\.)?github\.com\//, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
    .trim()

  // Strip extra path segments beyond owner/repo (e.g. /tree/main, /commits)
  const parts = normalized.split('/').filter(Boolean)
  if (parts.length >= 2) {
    normalized = `${parts[0]}/${parts[1]}`
  }

  return normalized
}

/**
 * Validate that a normalized repo string is in "owner/repo" format.
 */
function isValidRepo(repo: string): boolean {
  const parts = repo.split('/')
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0
}

export async function fetchRecentCommits(
  repo: string,
  token?: string,
  since?: string
): Promise<Commit[]> {
  const normalized = normalizeRepo(repo)

  if (!isValidRepo(normalized)) {
    throw new Error(
      `Invalid GitHub repository format: "${repo}". Expected "owner/repo" (e.g. "vercel/next.js").`
    )
  }

  const params = new URLSearchParams({ per_page: '30' })
  if (since) params.set('since', since)

  const url = `https://api.github.com/repos/${normalized}/commits?${params}`

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }

  const authToken = token ?? process.env.GITHUB_TOKEN
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch(url, { headers })

  if (!response.ok) {
    const body = await response.text().catch(() => '')

    if (response.status === 404) {
      throw new Error(
        `Repository "${normalized}" not found. Check the repo name or ensure the repository is public (or a valid token is configured).`
      )
    }

    if (response.status === 403) {
      throw new Error(
        `GitHub API rate limit exceeded or access denied for "${normalized}". Try again later or configure a GITHUB_TOKEN.`
      )
    }

    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}${body ? ` — ${body.slice(0, 200)}` : ''}`
    )
  }

  const data = await response.json()

  // Guard against non-array responses (e.g. error objects that slipped through)
  if (!Array.isArray(data)) {
    throw new Error(
      `Unexpected GitHub API response for "${normalized}". Expected an array of commits.`
    )
  }

  return data as Commit[]
}
