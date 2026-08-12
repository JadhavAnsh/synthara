"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { authClient } from "@/lib/auth-client";
import { verifyEmailRequestSchema } from "@/lib/validation/auth";
import { zodFieldErrors } from "@/lib/validation/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type VerifyState = "idle" | "verifying" | "verified" | "error";

export function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const token = searchParams.get("token");

  const [email, setEmail] = useState(initialEmail);
  const [showEmailInput, setShowEmailInput] = useState(!initialEmail);
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

      setResendMessage("We've sent a new verification link. Check your inbox and spam folder.");
    } catch {
      setResendError("Unable to resend verification email.");
    } finally {
      setIsResending(false);
    }
  }

  if (verifyState === "verifying") {
    return (
      <div className="w-full max-w-md rounded-xl border border-hairline bg-surface-card/70 p-8 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Spinner className="size-5 text-primary" />
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl text-ink">
          Verifying your email
        </h1>
        <p className="mt-2 text-sm text-body">Hang tight while we confirm your link.</p>
      </div>
    );
  }

  if (verifyState === "verified") {
    return (
      <div className="w-full max-w-md rounded-xl border border-hairline bg-surface-card/70 p-8 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-chart-2/15">
          <HugeiconsIcon icon={Tick02Icon} className="size-5 text-chart-2" strokeWidth={2} />
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl text-ink">
          Email verified
        </h1>
        <p className="mt-2 text-sm text-body">{verifyMessage}</p>
        <Button className="mt-8 w-full" size="lg" render={<Link href="/projects" />}>
          Go to projects
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-hairline bg-surface-card/70 p-8 shadow-sm">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
        <HugeiconsIcon icon={Mail01Icon} className="size-5 text-primary" strokeWidth={2} />
      </div>

      <div className="mt-6 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-ink">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm leading-6 text-body">
          We sent a verification link to your email. Open it to unlock your research workspace.
        </p>
      </div>

      {verifyState === "error" && verifyMessage ? (
        <p
          role="alert"
          className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {verifyMessage}
        </p>
      ) : null}

      <form onSubmit={handleResend} className="mt-8">
        <FieldGroup>
          <Field data-invalid={!!fieldErrors.email}>
            <FieldLabel htmlFor="email">Email address</FieldLabel>

            {!showEmailInput && email ? (
              <div className="rounded-md border border-hairline bg-canvas px-4 py-3">
                <p className="truncate text-sm font-medium text-ink">{email}</p>
                <button
                  type="button"
                  onClick={() => setShowEmailInput(true)}
                  className="mt-1 text-xs text-primary transition-colors hover:text-primary-active"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@university.edu"
                aria-invalid={!!fieldErrors.email}
                autoComplete="email"
              />
            )}

            {fieldErrors.email ? <FieldError>{fieldErrors.email}</FieldError> : null}
          </Field>

          {resendError ? (
            <p role="alert" className="text-sm text-destructive">
              {resendError}
            </p>
          ) : null}

          {resendMessage ? (
            <p
              role="status"
              className={cn(
                "rounded-md border border-chart-2/25 bg-chart-2/10 px-4 py-3 text-sm text-body-strong",
              )}
            >
              {resendMessage}
            </p>
          ) : null}

          <Button type="submit" className="w-full" size="lg" disabled={isResending}>
            {isResending ? "Sending..." : "Resend verification email"}
          </Button>
        </FieldGroup>
      </form>

      <ul className="mt-6 space-y-2 border-t border-hairline pt-6 text-sm text-muted-soft">
        <li>Links expire after a short time for security.</li>
        <li>Check spam or promotions if you do not see the email.</li>
      </ul>

      <p className="mt-6 text-center text-sm text-muted-soft">
        Wrong account?{" "}
        <Link href="/sign-in" className="font-medium text-primary transition-colors hover:text-primary-active">
          Sign in with a different email
        </Link>
      </p>
    </div>
  );
}
