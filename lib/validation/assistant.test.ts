import { describe, expect, it } from "vitest";

import { ASSISTANT_ACTIONS, assistantRequestSchema } from "@/lib/validation/assistant";

describe("assistantRequestSchema", () => {
  it.each(ASSISTANT_ACTIONS)("accepts the %s action", (action) => {
    expect(
      assistantRequestSchema.safeParse({ action, prompt: "Help with this research task" }).success,
    ).toBe(true);
  });

  it("rejects unsupported actions", () => {
    expect(assistantRequestSchema.safeParse({ action: "browse_files" }).success).toBe(false);
  });

  it("limits conversation history and editor context", () => {
    const oversizedMessages = Array.from({ length: 21 }, () => ({
      role: "user" as const,
      text: "Hello",
    }));

    expect(
      assistantRequestSchema.safeParse({
        action: "draft_section",
        messages: oversizedMessages,
      }).success,
    ).toBe(false);
    expect(
      assistantRequestSchema.safeParse({
        action: "rewrite_section",
        editorSelection: "x".repeat(12_001),
      }).success,
    ).toBe(false);
  });
});
