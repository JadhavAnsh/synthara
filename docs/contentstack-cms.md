# Contentstack CMS Setup

## What Contentstack Should Own

Use Contentstack for content that non-engineers should edit without code changes:

- Marketing page sections.
- Blog posts and release notes.
- Help center articles.
- Research document templates.
- Citation style guidance pages.
- Onboarding copy and empty-state guidance.

Keep application data in the product database, not Contentstack. Projects, documents, sources, citations, users, and chat history should remain in the app data layer.

## Environment Variables

```bash
CONTENTSTACK_API_KEY=
CONTENTSTACK_DELIVERY_TOKEN=
CONTENTSTACK_ENVIRONMENT=development
CONTENTSTACK_REGION=us
CONTENTSTACK_DEFAULT_LOCALE=en-us
```

Dashboard-issued values:

- `CONTENTSTACK_API_KEY`
- `CONTENTSTACK_DELIVERY_TOKEN`
- `CONTENTSTACK_ENVIRONMENT`
- `CONTENTSTACK_REGION`

App-owned defaults:

- `CONTENTSTACK_DEFAULT_LOCALE=en-us`

## Recommended Content Types

### Landing Page

- `title`
- `slug`
- `hero_headline`
- `hero_body`
- `primary_cta_label`
- `primary_cta_url`
- `sections`

### Help Article

- `title`
- `slug`
- `summary`
- `body`
- `category`
- `order`

### Research Template

- `title`
- `slug`
- `citation_style`
- `sections`
- `prompt_guidance`

### Release Note

- `title`
- `slug`
- `published_at`
- `summary`
- `body`

## How the App Uses It

`lib/cms/contentstack.ts` fetches published entries from the Delivery API. Example:

```ts
import { getContentstackEntries } from "@/lib/cms/contentstack";

const pages = await getContentstackEntries("landing_page");
```

## Setup Steps

1. Create a Contentstack stack for Synthara.
2. Create a `development` environment.
3. Create a Delivery Token for that environment.
4. Add the values to `.env.local`.
5. Create the recommended content types.
6. Publish at least one entry.
7. Fetch it from a server component or route handler using `getContentstackEntries`.

## Preview Later

Start with published Delivery API content. Add Contentstack preview tokens and live preview only after the published delivery flow is working.
