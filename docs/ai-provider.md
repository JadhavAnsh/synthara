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
```

## How the App Uses It

- `lib/ai/gemini.ts` builds the Gemini API request.
- `app/api/ai/route.ts` exposes a server route for assistant messages.
- The key is read on the server only.

## Example Request

```bash
curl -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","text":"Create a research outline about retrieval augmented generation for education."}]}'
```

## Production Notes

- Free-tier quotas are for development, not a full SaaS launch.
- Review the current Gemini pricing, rate limits, and data-use terms before production.
- Track token usage per user and project.
- Add a provider abstraction before adding paid fallbacks such as OpenAI, Anthropic, or OpenRouter.
