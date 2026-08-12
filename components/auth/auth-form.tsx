"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";

import { authClient } from "@/lib/auth-client";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import { zodFieldErrors } from "@/lib/validation/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};


export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/projects";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isSignUp = mode === "sign-up";

  async function checkEmailAvailability(emailToCheck: string) {
    const parsed = signUpSchema.pick({ email: true }).safeParse({ email: emailToCheck });

    if (!parsed.success) {
      setEmailExists(false);
      return true;
    }

    setIsCheckingEmail(true);

    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });

      const data = (await response.json()) as { available?: boolean; error?: string };

      if (!response.ok) {
        if (data.error) {
          setFieldErrors((current) => ({ ...current, email: data.error ?? "Enter a valid email address." }));
        }
        setEmailExists(false);
        return false;
      }

      if (!data.available) {
        setEmailExists(true);
        setFieldErrors((current) => {
          const next = { ...current };
          delete next.email;
          return next;
        });
        return false;
      }

      setEmailExists(false);
      return true;
    } catch {
      setError("Unable to verify email right now. Please try again.");
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  }

  async function handleEmailBlur() {
    if (!isSignUp || !email.trim()) {
      return;
    }

    await checkEmailAvailability(email);
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setEmailExists(false);
    setFieldErrors((current) => {
      if (!current.email) {
        return current;
      }

      const next = { ...current };
      delete next.email;
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = isSignUp
      ? signUpSchema.safeParse({ name, email, password })
      : signInSchema.safeParse({ email, password });

    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      if (isSignUp) {
        const signUpData = signUpSchema.parse({ name, email, password });
        const isEmailAvailable = await checkEmailAvailability(signUpData.email);

        if (!isEmailAvailable) {
          return;
        }

        const result = await authClient.signUp.email({
          email: signUpData.email,
          password: signUpData.password,
          name: signUpData.name || signUpData.email.split("@")[0] || "Researcher",
        });

        if (result.error) {
          setError(result.error.message || "Sign up failed.");
          return;
        }

        router.push(`/verify-email?email=${encodeURIComponent(signUpData.email)}`);
        router.refresh();
        return;
      }

      const signInData = signInSchema.parse({ email, password });

      const result = await authClient.signIn.email({
        email: signInData.email,
        password: signInData.password,
      });

      if (result.error) {
        const message = result.error.message || "Sign in failed.";

        if (message.toLowerCase().includes("verify")) {
          router.push(`/verify-email?email=${encodeURIComponent(signInData.email)}`);
          return;
        }

        setError(message);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      setError("Google sign-in failed. Check your OAuth configuration.");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-ink">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-body">
          {isSignUp
            ? "Start organizing research projects with Synthara."
            : "Sign in to continue your research workspace."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          {isSignUp ? (
            <Field data-invalid={!!fieldErrors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ada Lovelace"
                aria-invalid={!!fieldErrors.name}
              />
              {fieldErrors.name ? <FieldError>{fieldErrors.name}</FieldError> : null}
            </Field>
          ) : null}

          <Field data-invalid={!!fieldErrors.email || emailExists}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              onBlur={handleEmailBlur}
              placeholder="you@university.edu"
              aria-invalid={!!fieldErrors.email || emailExists}
            />
            {isSignUp && isCheckingEmail ? (
              <FieldDescription>Checking email availability...</FieldDescription>
            ) : null}
            {fieldErrors.email ? <FieldError>{fieldErrors.email}</FieldError> : null}
            {emailExists ? (
              <FieldError>
                An account with this email already exists.{" "}
                <Link href="/sign-in" className="font-medium underline">
                  Sign in instead
                </Link>
              </FieldError>
            ) : null}
          </Field>

          <Field data-invalid={!!fieldErrors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                aria-invalid={!!fieldErrors.password}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <HugeiconsIcon
                    icon={showPassword ? ViewOffIcon : ViewIcon}
                    className="size-3.5"
                    strokeWidth={2}
                  />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {isSignUp ? (
              <FieldDescription>Use at least 8 characters.</FieldDescription>
            ) : null}
            {fieldErrors.password ? <FieldError>{fieldErrors.password}</FieldError> : null}
          </Field>

          {error ? <FieldError>{error}</FieldError> : null}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isCheckingEmail || (isSignUp && emailExists)}
          >
            {isLoading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
          </Button>
        </FieldGroup>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignUp ? "Already have an account?" : "New to Synthara?"}{" "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-medium text-primary hover:underline"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
