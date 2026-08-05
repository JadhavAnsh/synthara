# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** Students writing research reports and papers — people who need to move from a broad question to a structured, cited draft without juggling separate search, notes, AI chat, and citation tools.

**Secondary (confirmed audiences, not first-priority):** Technical writers preparing evidence-backed documents; founders and analysts collecting market or technical evidence; engineers researching APIs, repositories, and implementation patterns.

## Product Purpose

Synthara is an AI research assistant SaaS that helps users discover sources, draft structured research documents, and manage citations from one workspace.

Success means a student can enter a research topic, collect credible sources across web, academic, and code channels, ask an assistant questions grounded in selected evidence, generate a structured outline, draft sections, and export the result with a reliable bibliography.

## Positioning

Synthara's differentiator is a **unified research workspace** where source discovery, document drafting, and citation metadata stay linked end-to-end — unlike workflows split across search engines, note apps, citation managers, writing tools, and standalone AI chats.

## Operating Context

Users work in a browser-based SaaS environment. Typical flow: submit a research question → search fans out to web, academic, and code sources → results normalize into a project source library → user selects sources → AI assistant answers or drafts from that context → document editor stores structured content and citation references → export renders Markdown, DOCX, or PDF with bibliography.

Marketing pages, help articles, release notes, and research templates are intended to be editable through Contentstack. Development currently uses Google Gemini (free tier) for assistant experiments; production provider choice, billing, and limits remain open decisions.

## Capabilities and Constraints

**Confirmed / planned capabilities:**

- Multi-channel source discovery: web search, academic APIs (Semantic Scholar, arXiv, CrossRef), GitHub repository search.
- Normalized source library with metadata and credibility signals.
- Dual-pane workspace: document editor (left) and AI research assistant (right).
- Citation engine with CSL-JSON-compatible internal model; IEEE and Harvard renderers planned first.
- Export to Markdown, DOCX, and PDF.
- Server-only integration boundaries for AI keys, CMS tokens, search keys, and database credentials.

**Current foundation (implemented):** Next.js App Router shell, Gemini-backed AI API route (`app/api/ai/route.ts`), Contentstack Delivery API helper (`lib/cms/contentstack.ts`), planning documentation under `docs/`.

**Planned but not yet built:** Auth and accounts, PostgreSQL with pgvector, Redis/BullMQ queues, Yjs or managed CRDT for collaborative editing, full search aggregation, Tiptap/ProseMirror editor, citation chips, streaming assistant UI, export engine, beta billing.

**Explicitly undecided:** Production AI provider, deployment target, pricing/licensing, auth provider selection, privacy and data-retention policy for uploaded sources, realtime collaboration scope for MVP.

## Brand Commitments

- **Name:** Synthara
- **Voice:** Academic/formal tone aimed at institutions — research-serious, credible, and precise rather than casual or hype-driven.
- Visual direction is not established here; incumbent landing page styling exists in code but is not a binding brand commitment until confirmed in design work.

## Evidence on Hand

- Product and architecture documentation: `README.md`, `docs/overview.md`, `docs/architecture.md`, `docs/implementation-plan.md`, `docs/ai-provider.md`, `docs/contentstack-cms.md`
- Runnable development shell at `app/page.tsx` describing product flow and stack
- AI route and Gemini integration for local development
- Contentstack helper wired for CMS delivery

**Do not fabricate:** Customer testimonials, case studies, press coverage, pricing tiers, licensing terms, production benchmarks, or deployment claims.

## Product Principles

1. **End-to-end linkage** — Sources, drafts, and citations must remain connected in one workspace from discovery through export; fragmentation is the problem Synthara solves.
2. **Evidence before assertion** — Assistant drafting and answers should reflect user-selected source context; missing or unsupported evidence must be surfaced honestly.
3. **Student-first workflow** — Prioritize the research-report path (topic → sources → outline → sections → bibliography) over power-user or enterprise edge cases in early releases.
4. **Citation reliability early** — Normalize and store citation metadata before optimizing polish features; export correctness is non-negotiable.
5. **Server-side trust** — Private keys, tokens, and provider calls stay on the server; the client talks to project routes, not raw secrets.
