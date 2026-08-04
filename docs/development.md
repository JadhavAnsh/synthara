# Development Notes

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment Checklist

- `GEMINI_API_KEY` is present for `/api/ai`.
- `CONTENTSTACK_API_KEY` is present for CMS reads.
- `CONTENTSTACK_DELIVERY_TOKEN` matches the selected environment.
- `CONTENTSTACK_ENVIRONMENT` matches the published Contentstack entries.

## Validation Checklist

- `npm run lint`
- `npm run build`
- `curl` the `/api/ai` route after adding a Gemini key.
- Fetch a known Contentstack content type after publishing one entry.

## Conventions

- Keep private provider keys server-side.
- Add new provider integrations under `lib`.
- Add public product documentation under `docs`.
- Add route handlers under `app/api`.
