# Email (Resend)

Synthara sends transactional email through [Resend](https://resend.com) with server-side validation via `validator` and disposable-domain blocking via `mailchecker`.

## Environment Variables

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=Synthara <onboarding@resend.dev>
RESEND_REPLY_TO=support@yourdomain.com
MAIL_APP_NAME=Synthara
```

- `RESEND_API_KEY`: API key from the Resend dashboard.
- `RESEND_FROM_EMAIL`: Verified sender address. Use `onboarding@resend.dev` for Resend sandbox testing.
- `RESEND_REPLY_TO`: Optional reply-to address for support mail.
- `MAIL_APP_NAME`: Brand name used in templates.

If `RESEND_API_KEY` is missing, emails are logged to the server console instead of being sent. This keeps local development working without external delivery.

## Validation

Email addresses are validated before sign-up and before any outbound send:

- RFC-style format checks via `validator`
- Disposable / blocked domains rejected via `mailchecker`

Shared Zod field: `lib/validation/email.ts` (`emailFieldSchema`).

## Sending Email

Core helpers live in `lib/email/`:

```ts
import {
  sendCustomEmail,
  sendTemplatedEmail,
  sendVerificationEmailMessage,
  sendWelcomeEmailMessage,
} from "@/lib/email";

await sendTemplatedEmail({
  to: "user@university.edu",
  template: "welcome",
  data: {
    recipientName: "Ada",
    dashboardUrl: "https://app.synthara.com/projects",
  },
});

await sendCustomEmail({
  to: "user@university.edu",
  subject: "Your export is ready",
  html: "<p>Your document export finished.</p>",
  text: "Your document export finished.",
});
```

Built-in templates:

- `verification` — account email confirmation
- `welcome` — post-verification onboarding

## Authenticated API

Verified users can send mail through:

`POST /api/email/send`

```json
{
  "to": "user@university.edu",
  "subject": "Synthara notification",
  "html": "<p>Custom HTML body</p>",
  "text": "Custom text body"
}
```

Or with a template:

```json
{
  "to": "user@university.edu",
  "template": "welcome",
  "templateData": {
    "recipientName": "Ada",
    "dashboardUrl": "http://localhost:3000/projects"
  }
}
```

## Auth Integration

Better Auth uses `sendVerificationEmailMessage` for required email verification. Sign-up rejects invalid or disposable addresses before user records are created.

Verification email policy:

- One email on sign-up (`sendOnSignUp`)
- One email when an unverified user tries to sign in (`sendOnSignIn`)
- `autoSignIn: false` on email/password sign-up so registration does not immediately trigger a second verification send
- A 60-second dedupe window in `sendVerificationEmailMessage` prevents accidental double delivery
