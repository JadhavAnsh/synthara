# Implementation Plan

## Phase 1: Foundation

Goal: turn the starter app into a stable SaaS base.

- Finalize branding, layout shell, navigation, and design tokens.
- Keep Gemini wired as the free-friendly development AI provider.
- Keep Contentstack wired for editable content.
- Add auth provider selection and account model.
- Add database schema for users, projects, documents, sources, and citations.
- Add validation rules for topic length and citation style selection.

## Phase 2: Search and Source Ingestion

Goal: collect useful research sources from multiple channels.

- Add web search provider integration.
- Add Semantic Scholar, arXiv, and CrossRef for academic sources.
- Add GitHub repository search for code and library evidence.
- Normalize all results into a shared `Source` schema.
- Add per-channel loading, empty, timeout, and rate-limit states.
- Cache successful searches and retry failed upstream calls through a queue.

## Phase 3: Workspace and Editor

Goal: create the core research workspace.

- Add a dual-pane layout with editor and assistant.
- Integrate Tiptap or another ProseMirror-based editor.
- Add citation chips, headings, outline navigation, and comments.
- Add project source library selection.
- Persist document state by project.

## Phase 4: AI Assistant

Goal: make assistant output grounded and useful.

- Add tools for summarize source, propose outline, draft section, rewrite section, and insert citation.
- Retrieve selected source context before drafting.
- Stream assistant responses into the chat UI.
- Add server-side checks for missing sources and unsupported actions.
- Track model usage so free-tier limits are visible during development.

## Phase 5: Citation Engine

Goal: make citations reliable before export.

- Store citation metadata in CSL-JSON-compatible form.
- Add IEEE and Harvard renderers first.
- Require citation style before structure generation.
- Generate bibliography from stored citation metadata.
- Allow citation style switching without refetching source metadata.

## Phase 6: Export and CMS Content

Goal: prepare the product for demos and beta users.

- Export Markdown first, then DOCX and PDF.
- Add Contentstack-backed marketing pages, help articles, release notes, and research templates.
- Add Contentstack preview support only after delivery publishing works.
- Add CMS content-model migration notes.

## Phase 7: Beta Hardening

Goal: make the app reliable enough for invited users.

- Add monitoring, structured logs, and provider error tracking.
- Add rate-limit dashboards for AI and search APIs.
- Load-test source ingestion.
- Add billing plans only after usage patterns are understood.
- Review privacy and data retention for uploaded or pasted research sources.
