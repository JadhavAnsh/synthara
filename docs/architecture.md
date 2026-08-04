# Architecture

## Application Layers

| Layer | Responsibility |
| --- | --- |
| Next.js App Router | User interface, server routes, server-rendered CMS pages |
| AI provider layer | Research assistant prompts, drafting, summarization, outline generation |
| CMS layer | Marketing content, help docs, release notes, templates |
| Search aggregation | Web, academic, and GitHub source discovery |
| Document workspace | Editor state, citation chips, section outline, comments |
| Data layer | Users, projects, documents, sources, citations, embeddings |
| Queue/cache layer | API retry jobs, rate-limit control, source caching |

## Current Integrations

- `lib/ai/gemini.ts` wraps Google Gemini calls behind a project-specific function.
- `app/api/ai/route.ts` exposes a server-only assistant endpoint.
- `lib/cms/contentstack.ts` fetches published Contentstack entries through the Delivery API.

## Planned Data Model

- `users`: profile and auth provider identity.
- `projects`: topic, owner, citation format, status.
- `sources`: title, authors, URL, source type, snippets, credibility signals.
- `documents`: editor state, export status, selected citation style.
- `citations`: CSL-JSON metadata connected to sources and document ranges.
- `messages`: assistant conversation history scoped to a project.
- `embeddings`: vectors for semantic retrieval across selected source content.

## Request Flow

1. User submits a research question.
2. Search aggregation fans out to web, academic, and code sources.
3. Results are normalized, deduplicated, and cached.
4. User selects sources for a project.
5. Assistant answers or drafts using selected source context.
6. Editor stores structured document state and citation references.
7. Export engine renders DOCX, PDF, or Markdown.

## Provider Boundaries

Keep AI keys, Contentstack delivery tokens, search provider keys, and database credentials on the server. Client components should call server routes instead of reading private environment variables directly.
