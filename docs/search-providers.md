# Search Providers

Phase 2 fans out research queries to web, academic, and GitHub channels. All provider keys stay server-side in `.env.local`.

## Required keys

| Variable | Channel | Setup |
| --- | --- | --- |
| `TAVILY_API_KEY` | Web | Create a key at [tavily.com](https://tavily.com). Free dev tier works for local search. |
| `CROSSREF_MAILTO` | Academic (CrossRef) | Your contact email for CrossRef polite pool. No API key required. |

## Optional keys

| Variable | Channel | Setup |
| --- | --- | --- |
| `GITHUB_TOKEN` | GitHub | Personal access token with public repo read scope. Raises GitHub REST rate limits during local development. |

## No-key providers

These academic providers run without API keys:

- **Semantic Scholar** — paper metadata and abstracts
- **arXiv** — preprint search via Atom API
- **CrossRef** — DOI metadata (requires polite `mailto` only)

## Rate limits and retries

- Each channel uses a 10 second timeout.
- Failed, timed out, or rate-limited channels enqueue a MongoDB retry job for that project.
- Successful multi-channel searches are cached for 24 hours in MongoDB.
- A future Redis/BullMQ worker can replace the inline retry processor without changing API contracts.

## Local setup

```bash
cp .env.example .env.local
```

Add at minimum:

```bash
TAVILY_API_KEY=your_tavily_key
CROSSREF_MAILTO=you@example.com
```

Then create a project, open `/projects/[id]`, and run a search against the project topic.

## Expected channel behavior

- **Web** fails fast with a clear error if `TAVILY_API_KEY` is missing.
- **Academic** can still return results when one upstream provider fails because Semantic Scholar, arXiv, and CrossRef run in parallel and merge.
- **GitHub** works without a token but may hit lower anonymous rate limits.
