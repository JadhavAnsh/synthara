# AI Provider Setup

## Recommended Free-Friendly Provider

Use the Google Gemini Developer API for development because it provides free-tier access with lower limits. This is best for local development, MVP demos, summarization, outline generation, and early drafting flows.

## Setup

1. Open [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create an API key.
3. Copy `.env.example` to `.env.local`.
4. Set:

```bash
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash
AI_DEVELOPMENT_TOKEN_BUDGET=1000000
```

## How the App Uses It

- `lib/ai/assistant.ts` streams grounded Gemini responses through the AI SDK.
- `app/api/projects/[id]/assistant/route.ts` validates project ownership, selected sources, and supported actions.
- The workspace supports source summary, outline, section drafting, selection rewriting, and citation insertion.
- Monthly per-project token usage is persisted and displayed against `AI_DEVELOPMENT_TOKEN_BUDGET`.
- The key is read on the server only.

## Example Request

```bash
curl -X POST http://localhost:3000/api/projects/PROJECT_ID/assistant \
  -H "Content-Type: application/json" \
  -d '{"action":"propose_outline","prompt":"Create an outline for the selected evidence.","messages":[]}'
```

The request requires an authenticated, verified session and at least one selected project source.

## Production Notes

- Free-tier quotas are for development, not a full SaaS launch.
- Review the current Gemini pricing, rate limits, and data-use terms before production.
- Add a provider abstraction before adding paid fallbacks such as OpenAI, Anthropic, or OpenRouter.
