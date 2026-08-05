"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { verifyEmailRequestSchema } from "@/lib/validation/auth";
import { zodFieldErrors } from "@/lib/validation/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type VerifyState = "idle" | "verifying" | "verified" | "error";

export function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const token = searchParams.get("token");

  const [email, setEmail] = useState(initialEmail);
  const [verifyState, setVerifyState] = useState<VerifyState>(token ? "verifying" : "idle");
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    async function verifyToken(currentToken: string) {
      setVerifyState("verifying");
      setVerifyMessage(null);

      const result = await authClient.verifyEmail({
        query: { token: currentToken },
      });

      if (cancelled) {
        return;
      }

      if (result.error) {
        setVerifyState("error");
        setVerifyMessage(result.error.message || "Verification link is invalid or expired.");
        return;
      }

      setVerifyState("verified");
      setVerifyMessage("Your email is verified. You can continue to your workspace.");
      await authClient.getSession();
    }

    void verifyToken(token);

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleResend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResendError(null);
    setResendMessage(null);

    const parsed = verifyEmailRequestSchema.safeParse({ email });

    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setIsResending(true);

    try {
      const result = await authClient.sendVerificationEmail({
        email: parsed.data.email,
        callbackURL: "/projects",
      });

      if (result.error) {
        setResendError(result.error.message || "Unable to resend verification email.");
        return;
      }

      setResendMessage("Verification email sent. Check your inbox or the server logs in development.");
    } catch {
      setResendError("Unable to resend verification email.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-ink">
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-body">
          We sent a verification link to your inbox. You must verify before accessing projects.
        </p>
      </div>

      {verifyState === "verifying" ? (
        <p className="text-sm text-muted-foreground">Verifying your email...</p>
      ) : null}

      {verifyMessage ? (
        <p
          className={
            verifyState === "verified"
              ? "mb-6 rounded-md border border-hairline bg-surface-card px-4 py-3 text-sm text-body-strong"
              : "mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          }
        >
          {verifyMessage}
        </p>
      ) : null}

      {verifyState === "verified" ? (
        <Button render={<a href="/projects" />}>Go to projects</Button>
      ) : (
        <form onSubmit={handleResend}>
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@university.edu"
                aria-invalid={!!fieldErrors.email}
              />
              <FieldDescription>
                In development without Resend, emails are logged in the server console.
              </FieldDescription>
              {fieldErrors.email ? <FieldError>{fieldErrors.email}</FieldError> : null}
            </Field>

            {resendError ? <FieldError>{resendError}</FieldError> : null}
            {resendMessage ? (
              <p className="text-sm text-body-strong">{resendMessage}</p>
            ) : null}

            <Button type="submit" disabled={isResending}>
              {isResending ? "Sending..." : "Resend verification email"}
            </Button>
          </FieldGroup>
        </form>
      )}
    </div>
  );
}
