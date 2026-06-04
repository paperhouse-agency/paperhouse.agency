// GitHub Contents API — used in production to commit content changes to the repo.
// Requires GITHUB_TOKEN (PAT with `contents: write`), GITHUB_OWNER, GITHUB_REPO.
// GITHUB_BRANCH defaults to "main".
//
// Only active when GITHUB_TOKEN is present — development falls back to filesystem only.

const TOKEN = process.env.GITHUB_TOKEN
const OWNER = process.env.GITHUB_OWNER
const REPO = process.env.GITHUB_REPO
const BRANCH = process.env.GITHUB_BRANCH ?? 'main'

const API = 'https://api.github.com'

const baseHeaders = () => ({
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
})

export function isGitHubConfigured(): boolean {
  return !!(TOKEN && OWNER && REPO)
}

async function getFileSha(repoPath: string): Promise<string | null> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${repoPath}?ref=${BRANCH}`,
    { headers: baseHeaders() },
  )
  if (!res.ok) return null
  const data = (await res.json()) as { sha?: string }
  return data.sha ?? null
}

export async function commitFile(repoPath: string, content: string, message: string): Promise<void> {
  if (!isGitHubConfigured()) throw new Error('GitHub not configured')

  const sha = await getFileSha(repoPath)
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
    method: 'PUT',
    headers: baseHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = (await res.json()) as { message?: string }
    throw new Error(`GitHub API error: ${err.message ?? res.status}`)
  }
}

export async function deleteFile(repoPath: string, message: string): Promise<void> {
  if (!isGitHubConfigured()) throw new Error('GitHub not configured')

  const sha = await getFileSha(repoPath)
  if (!sha) return // file doesn't exist in repo, nothing to delete

  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
    method: 'DELETE',
    headers: baseHeaders(),
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  })

  if (!res.ok) {
    const err = (await res.json()) as { message?: string }
    throw new Error(`GitHub API error: ${err.message ?? res.status}`)
  }
}
