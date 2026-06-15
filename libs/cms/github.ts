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

// Commits multiple files in a single git commit using the Tree API.
// This triggers only one Vercel build regardless of how many files changed.
export async function commitAllFiles(
  files: { path: string; content: string }[],
  message: string,
): Promise<void> {
  if (!isGitHubConfigured()) throw new Error('GitHub not configured')

  // 1. Get the latest commit SHA on the branch
  const refRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`, {
    headers: baseHeaders(),
  })
  if (!refRes.ok) throw new Error('GitHub: failed to get branch ref')
  const refData = (await refRes.json()) as { object: { sha: string } }
  const latestCommitSha = refData.object.sha

  // 2. Get the tree SHA from that commit
  const commitRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/commits/${latestCommitSha}`, {
    headers: baseHeaders(),
  })
  if (!commitRes.ok) throw new Error('GitHub: failed to get commit')
  const commitData = (await commitRes.json()) as { tree: { sha: string } }
  const baseTreeSha = commitData.tree.sha

  // 3. Create a new tree with all the files
  const tree = files.map(({ path, content }) => ({
    path,
    mode: '100644',
    type: 'blob',
    content,
  }))

  const treeRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/trees`, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  })
  if (!treeRes.ok) throw new Error('GitHub: failed to create tree')
  const treeData = (await treeRes.json()) as { sha: string }

  // 4. Create a new commit
  const newCommitRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/commits`, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify({
      message,
      tree: treeData.sha,
      parents: [latestCommitSha],
    }),
  })
  if (!newCommitRes.ok) throw new Error('GitHub: failed to create commit')
  const newCommitData = (await newCommitRes.json()) as { sha: string }

  // 5. Update the branch ref
  const updateRes = await fetch(`${API}/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    headers: baseHeaders(),
    body: JSON.stringify({ sha: newCommitData.sha }),
  })
  if (!updateRes.ok) throw new Error('GitHub: failed to update branch ref')
}
