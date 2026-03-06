import Anthropic from '@anthropic-ai/sdk'
import type { Commit } from './github'

const SKIP_PREFIXES = [
  'chore:',
  'chore(',
  'test:',
  'test(',
  'ci:',
  'ci(',
  'docs:',
  'docs(',
  'Merge ',
  'merge ',
  'bump version',
  'Bump version',
  'version bump',
  'Version bump',
]

function filterCommits(commits: Commit[]): Commit[] {
  return commits.filter((commit) => {
    const message = commit.commit.message.trim()
    return !SKIP_PREFIXES.some((prefix) => message.startsWith(prefix))
  })
}

export async function generateChangelogEntry(
  commits: Commit[]
): Promise<{ title: string; content: string }> {
  const filtered = filterCommits(commits)

  if (filtered.length === 0) {
    return {
      title: 'Minor improvements and fixes',
      content: 'Various internal improvements and bug fixes.',
    }
  }

  const commitMessages = filtered
    .slice(0, 20)
    .map((c) => c.commit.message.split('\n')[0])
    .join('\n')

  const client = new Anthropic()

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are writing a customer-facing changelog entry. Transform these git commits into a clear, exciting announcement that customers will understand. Focus on what changed from the user's perspective, not technical details.

Return a JSON object with exactly two fields:
- "title": a short, engaging title (max 60 chars)
- "content": markdown content explaining the changes (2-4 paragraphs or bullet points)

Git commits:
${commitMessages}

Respond with only the JSON object, no other text.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(text)
    return {
      title: parsed.title || 'New updates',
      content: parsed.content || text,
    }
  } catch {
    return {
      title: 'New updates',
      content: text,
    }
  }
}
