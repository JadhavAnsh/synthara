import type { AssistantAction } from "@/lib/validation/assistant";
import { apiFetch } from "@/lib/api/client";

export type AssistantUsage = {
  requestCount: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  budget: number;
  remainingTokens: number;
  period: string;
};

export type AssistantStreamInput = {
  action: AssistantAction;
  prompt: string;
  sourceId?: string;
  editorSelection?: string;
  messages: Array<{ role: "user" | "assistant"; text: string }>;
};

export async function fetchAssistantUsage(projectId: string) {
  const data = await apiFetch<{ usage: AssistantUsage }>(
    `/api/projects/${projectId}/assistant`,
  );
  return data.usage;
}

export async function openAssistantStream(
  projectId: string,
  input: AssistantStreamInput,
  signal: AbortSignal,
) {
  const response = await fetch(`/api/projects/${projectId}/assistant`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || "The assistant request failed.");
  }

  if (!response.body) {
    throw new Error("The assistant returned an empty stream.");
  }

  return response.body.getReader();
}
