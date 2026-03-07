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

function normalizeRepo(repo: string): string {
  return repo
    .replace(/^https?:\/\/(www\.)?github\.com\//, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
    .trim()
}

export async function fetchRecentCommits(
  repo: string,
  token?: string,
  since?: string
): Promise<Commit[]> {
  const normalized = normalizeRepo(repo)
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
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}${body ? ` — ${body.slice(0, 200)}` : ''}`)
  }

  const commits: Commit[] = await response.json()
  return commits
}
