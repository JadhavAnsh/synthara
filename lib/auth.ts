import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

import { getAuthBaseUrl } from "@/lib/auth/config";
import { sendVerificationEmailMessage } from "@/lib/email/messages/verification";
import { validateEmailAddress } from "@/lib/email/validate";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/synthara";

const client = new MongoClient(uri);
const db = client.db();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL: getAuthBaseUrl(),
  secret: process.env.BETTER_AUTH_SECRET ?? "development-secret-replace-in-production-32chars",
  advanced: {
    trustedProxyHeaders: true,
  },
  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const validation = validateEmailAddress(user.email);

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      await sendVerificationEmailMessage({
        to: validation.normalized,
        url,
        recipientName: user.name,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // Prevent sign-up from auto-signing in, which would also trigger sendOnSignIn
    // and deliver a second verification email for the same registration.
    autoSignIn: false,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const validation = validateEmailAddress(user.email);

          if (!validation.valid) {
            throw new Error(validation.error);
          }

          return {
            data: {
              ...user,
              email: validation.normalized,
            },
          };
        },
      },
    },
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : undefined,
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
