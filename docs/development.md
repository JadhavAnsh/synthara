# Development Notes

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## MongoDB

Run MongoDB locally with Docker:

```bash
docker run -d --name synthara-mongo -p 27017:27017 mongo:7
```

Or use MongoDB Atlas and set `MONGODB_URI` to your cluster connection string.

## Environment Checklist

- `MONGODB_URI` points to a reachable MongoDB instance.
- `BETTER_AUTH_SECRET` is a random 32+ character string.
- `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` match your local dev URL.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set if you want Google OAuth.
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set for outbound email.
- `GEMINI_API_KEY` is present for `/api/ai`.
- `CONTENTSTACK_API_KEY` is present for CMS reads.
- `CONTENTSTACK_DELIVERY_TOKEN` matches the selected environment.
- `CONTENTSTACK_ENVIRONMENT` matches the published Contentstack entries.

## Auth Setup

Better Auth is mounted at `/api/auth/*`.

- Email/password sign-up and sign-in are enabled.
- **Email verification is required** before accessing `/projects` or project APIs.
- Verification and custom mail are sent through Resend (`docs/email.md`).
- Google OAuth redirect URI for local dev:
  `http://localhost:3000/api/auth/callback/google`
- Protected routes: `/projects/*`, `/api/projects/*`, `/api/ai` (via `proxy.ts`)
- Client auth state: Zustand (`stores/auth-store.ts`) synced from Better Auth session
- API data fetching: TanStack React Query (`hooks/use-projects.ts`)

## Validation Rules

Project creation validates:

- `topic`: 10–300 characters after trimming
- `citationStyle`: `ieee` or `harvard`

Schemas live in `lib/validation/project.ts` and are enforced in both the create-project form and `POST /api/projects`.

## Validation Checklist

- `npm run lint`
- `npm run build`
- Sign up and sign in at `/sign-up` and `/sign-in`
- Create a project at `/projects/new`
- `curl` the `/api/ai` route with a session cookie after adding a Gemini key
- Fetch a known Contentstack content type after publishing one entry

## Conventions

- Keep private provider keys server-side.
- Add new provider integrations under `lib`.
- Add public product documentation under `docs`.
- Add route handlers under `app/api`.
- Better Auth owns auth collections; Mongoose owns app domain models.
