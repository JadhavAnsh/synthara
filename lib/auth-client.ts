import { createAuthClient } from "better-auth/react";

// Same-origin /api/auth keeps auth working across local, preview, and
// Contentstack hosts without baking a single NEXT_PUBLIC_APP_URL at build time.
export const authClient = createAuthClient();
