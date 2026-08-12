# Synthara

Synthara is an AI research assistant SaaS for discovering sources, drafting structured research documents, and managing citations from one workspace.

The product direction is a dual-pane interface: a document editor on the left and an AI research assistant on the right. The assistant helps users search web, academic, and code sources, summarize selected evidence, draft document sections, and keep citation metadata ready for export.

## Current Stack

- **App framework:** Next.js App Router, React, TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **AI provider for development:** Google Gemini Developer API
- **CMS:** Contentstack Delivery API
- **Planned data layer:** PostgreSQL with pgvector for metadata and semantic retrieval
- **Planned realtime layer:** Yjs or a managed CRDT service for collaborative document editing
- **Search cache/retry (Phase 2):** MongoDB per-channel cache (24h TTL) and retry queue with inline processing on subsequent searches
- **Planned queues/cache upgrade:** Redis and BullMQ worker for background search retries at scale

## Free AI API Provider

This project is configured for Google Gemini because the Gemini Developer API has a free tier suitable for development and prototypes. Use it for local development, demos, source summarization, outline generation, and drafting experiments. For production, revisit limits, billing, privacy terms, and model choice.

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create an API key.
3. Copy `.env.example` to `.env.local`.
4. Add the key:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-2.5-flash
```

The server route at `app/api/ai/route.ts` calls Gemini through `lib/ai/gemini.ts`. Keep `GEMINI_API_KEY` server-only; do not prefix it with `NEXT_PUBLIC_`.

## Contentstack CMS

Use Contentstack for editable marketing pages, help articles, release notes, landing-page copy, research templates, and citation-style guidance.

Required local values:

```bash
CONTENTSTACK_API_KEY=
CONTENTSTACK_DELIVERY_TOKEN=
CONTENTSTACK_ENVIRONMENT=development
CONTENTSTACK_REGION=us
CONTENTSTACK_DEFAULT_LOCALE=en-us
```

Copy `CONTENTSTACK_API_KEY`, `CONTENTSTACK_DELIVERY_TOKEN`, and the environment name from your Contentstack stack. The helper in `lib/cms/contentstack.ts` reads published entries through the Content Delivery API.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
```


## Documentation

- [Project overview](./docs/overview.md)
- [Architecture](./docs/architecture.md)
- [Implementation plan](./docs/implementation-plan.md)
- [AI provider setup](./docs/ai-provider.md)
- [Contentstack CMS setup](./docs/contentstack-cms.md)