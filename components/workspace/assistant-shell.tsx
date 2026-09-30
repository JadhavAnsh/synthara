"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { fetchAssistantUsage, openAssistantStream } from "@/lib/api/assistant";
import type { SourceSummary } from "@/lib/api/sources";
import {
  ASSISTANT_ACTION_LABELS,
  ASSISTANT_ACTIONS,
  type AssistantAction,
} from "@/lib/validation/assistant";
import { cn } from "@/lib/utils";

type AssistantShellProps = {
  projectId: string;
  selectedSources: SourceSummary[];
  getEditorSelection: () => string;
  onInsertCitation: (source: SourceSummary) => Promise<void>;
};

type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  action?: AssistantAction;
};

const ACTION_PLACEHOLDERS: Record<AssistantAction, string> = {
  summarize_source: "What should the summary emphasize? (optional)",
  propose_outline: "Describe the document goal or constraints…",
  draft_section: "Name the section and what it should establish…",
  rewrite_section: "How should the selected text change?",
  insert_citation: "What nearby claim should this citation support? (optional)",
};

const usageKey = (projectId: string) => ["projects", projectId, "assistant-usage"] as const;

export function AssistantShell({
  projectId,
  selectedSources,
  getEditorSelection,
  onInsertCitation,
}: AssistantShellProps) {
  const queryClient = useQueryClient();
  const [action, setAction] = useState<AssistantAction>("propose_outline");
  const [prompt, setPrompt] = useState("");
  const [sourceId, setSourceId] = useState(selectedSources[0]?.id ?? "");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { data: usage } = useQuery({
    queryKey: usageKey(projectId),
    queryFn: () => fetchAssistantUsage(projectId),
  });

  const requiresSource = action === "summarize_source" || action === "insert_citation";
  const selectedSource = useMemo(
    () => selectedSources.find((source) => source.id === sourceId) ?? selectedSources[0],
    [selectedSources, sourceId],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function handleSubmit() {
    if (isStreaming || selectedSources.length === 0) {
      return;
    }

    const editorSelection = action === "rewrite_section" ? getEditorSelection() : "";
    if (action === "rewrite_section" && !editorSelection) {
      setError("Select text in the editor before using Rewrite selection.");
      return;
    }
    if (requiresSource && !selectedSource) {
      setError("Choose a selected source for this action.");
      return;
    }
    if (!prompt.trim() && action !== "summarize_source" && action !== "insert_citation") {
      setError("Add a short instruction for this action.");
      return;
    }

    const userText = prompt.trim() || ASSISTANT_ACTION_LABELS[action];
    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: userText,
      action,
    };
    const assistantId = crypto.randomUUID();
    const history = messages.map(({ role, text }) => ({ role, text }));

    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", text: "", action },
    ]);
    setPrompt("");
    setError(null);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const reader = await openAssistantStream(
        projectId,
        {
          action,
          prompt: userText,
          sourceId: requiresSource ? selectedSource?.id : undefined,
          editorSelection: editorSelection || undefined,
          messages: history,
        },
        controller.signal,
      );

      if (action === "insert_citation" && selectedSource) {
        await onInsertCitation(selectedSource);
      }

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        accumulated += decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, text: accumulated } : message,
          ),
        );
      }

      accumulated += decoder.decode();
      if (!accumulated.trim()) {
        throw new Error("The assistant returned no text.");
      }
    } catch (streamError) {
      if (controller.signal.aborted) {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId && !message.text
              ? { ...message, text: "Response stopped." }
              : message,
          ),
        );
      } else {
        const message = streamError instanceof Error ? streamError.message : "Assistant failed.";
        setError(message);
        setMessages((current) => current.filter((item) => item.id !== assistantId));
      }
    } finally {
      abortRef.current = null;
      setIsStreaming(false);
      await queryClient.invalidateQueries({ queryKey: usageKey(projectId) });
    }
  }

  const usagePercent = usage ? Math.min(100, (usage.totalTokens / usage.budget) * 100) : 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-dark text-on-dark">
      <div className="shrink-0 border-b border-white/10 px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-full",
                selectedSources.length ? "bg-[#5db8a6]" : "bg-white/20",
              )}
            />
            <p className="text-xs font-medium uppercase tracking-wide text-on-dark-soft">
              Research assistant
            </p>
          </div>
          {usage ? (
            <span className="font-mono text-[0.625rem] text-on-dark-soft">
              {usage.totalTokens.toLocaleString()} / {usage.budget.toLocaleString()} tokens
            </span>
          ) : null}
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-primary transition-[width]" style={{ width: `${usagePercent}%` }} />
        </div>
      </div>

      <div className="shrink-0 border-b border-white/10 px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {ASSISTANT_ACTIONS.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              disabled={isStreaming}
              variant={action === item ? "default" : "outline"}
              className={cn(
                "min-h-9 shrink-0 px-3 text-xs",
                action !== item && "border-white/10 bg-white/5 text-on-dark-soft hover:bg-white/10",
              )}
              onClick={() => {
                setAction(item);
                setError(null);
              }}
              aria-pressed={action === item}
            >
              {ASSISTANT_ACTION_LABELS[item]}
            </Button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="max-w-xs text-sm leading-7 text-on-dark-soft">
              {selectedSources.length
                ? `${selectedSources.length} selected source${selectedSources.length === 1 ? " is" : "s are"} ready. Choose a grounded action above.`
                : "Select sources above before asking the assistant to draft or analyze evidence."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[96%] break-words rounded-xl whitespace-pre-wrap px-3.5 py-3 text-sm leading-7",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-white/10 bg-white/5 text-on-dark-soft",
                  )}
                >
                  {message.text || <Spinner className="size-4 text-primary" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 space-y-2 border-t border-white/10 bg-surface-dark-elevated/70 p-3">
        {requiresSource && selectedSources.length ? (
          <select
            aria-label="Source for assistant action"
            value={selectedSource?.id ?? ""}
            onChange={(event) => setSourceId(event.target.value)}
            className="h-9 w-full border border-white/10 bg-surface-dark px-2.5 text-xs text-on-dark outline-none focus:border-primary"
          >
            {selectedSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.title}
              </option>
            ))}
          </select>
        ) : null}

        <Textarea
          aria-label="Assistant instruction"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleSubmit();
            }
          }}
          placeholder={ACTION_PLACEHOLDERS[action]}
          disabled={isStreaming || selectedSources.length === 0}
          className="min-h-20 border-white/10 bg-white/5 text-on-dark placeholder:text-on-dark-soft"
        />

        {error ? <p role="alert" className="text-xs leading-5 text-[#ffa99a]">{error}</p> : null}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-on-dark-soft">Enter to send<br />Shift+Enter for a new line</p>
          {isStreaming ? (
            <Button type="button" size="sm" variant="outline" onClick={() => abortRef.current?.abort()}>
              Stop
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={selectedSources.length === 0}
              onClick={() => void handleSubmit()}
            >
              Run action
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
