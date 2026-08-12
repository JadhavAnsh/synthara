"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCreateProject } from "@/hooks/use-projects";
import { ApiError } from "@/lib/api/client";
import { createProjectSchema, type CitationStyle } from "@/lib/validation/project";
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
import {
  CITATION_STYLE_LABELS,
  CITATION_STYLES,
} from "@/lib/validation/project";

export function CreateProjectForm() {
  const router = useRouter();
  const createProject = useCreateProject();

  const [topic, setTopic] = useState("");
  const [citationStyle, setCitationStyle] = useState<CitationStyle>("ieee");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const parsed = createProjectSchema.safeParse({ topic, citationStyle });

    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }

    setErrors({});

    try {
      await createProject.mutateAsync(parsed.data);
      router.push("/projects");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        const payload = error.payload as { issues?: Record<string, string[]> };

        if (payload.issues) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, messages] of Object.entries(payload.issues)) {
            if (messages[0]) {
              fieldErrors[key] = messages[0];
            }
          }
          setErrors(fieldErrors);
          return;
        }
      }

      setSubmitError(error instanceof Error ? error.message : "Unable to create project.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <FieldGroup>
        <Field data-invalid={!!errors.topic}>
          <FieldLabel htmlFor="topic">Research topic</FieldLabel>
          <Input
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="How does retrieval augmented generation improve student research workflows?"
            aria-invalid={!!errors.topic}
          />
          <FieldDescription>
            10–300 characters. This becomes your project focus and future search seed.
          </FieldDescription>
          {errors.topic ? <FieldError>{errors.topic}</FieldError> : null}
        </Field>

        <Field data-invalid={!!errors.citationStyle}>
          <FieldLabel htmlFor="citationStyle">Citation style</FieldLabel>
          <select
            id="citationStyle"
            value={citationStyle}
            onChange={(event) => setCitationStyle(event.target.value as CitationStyle)}
            className="h-10 w-full rounded-md border border-input bg-canvas px-3 text-sm text-ink outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-invalid={!!errors.citationStyle}
          >
            {CITATION_STYLES.map((style) => (
              <option key={style} value={style}>
                {CITATION_STYLE_LABELS[style]}
              </option>
            ))}
          </select>
          {errors.citationStyle ? <FieldError>{errors.citationStyle}</FieldError> : null}
        </Field>

        {submitError ? <FieldError>{submitError}</FieldError> : null}

        <div className="flex gap-3">
          <Button type="submit" disabled={createProject.isPending}>
            {createProject.isPending ? "Creating..." : "Create project"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={createProject.isPending}
            onClick={() => router.push("/projects")}
          >
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
