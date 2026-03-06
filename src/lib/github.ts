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

export async function fetchRecentCommits(
  repo: string,
  token?: string,
  since?: string
): Promise<Commit[]> {
  const params = new URLSearchParams({ per_page: '30' })
  if (since) params.set('since', since)

  const url = `https://api.github.com/repos/${repo}/commits?${params}`

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const commits: Commit[] = await response.json()
  return commits
}
