import { describe, expect, it } from "vitest";

import { parseDraftBlockStart, splitCompleteWords } from "./word-stream";

describe("splitCompleteWords", () => {
  it("keeps a word split across network chunks until its boundary arrives", () => {
    const first = splitCompleteWords("", "Research sou");
    expect(first).toEqual({ complete: "Research ", pending: "sou" });
    expect(splitCompleteWords(first.pending, "rces matter.")).toEqual({
      complete: "sources ",
      pending: "matter.",
    });
  });

  it("preserves line breaks and recognizes streamed section headings", () => {
    const result = splitCompleteWords("", "## Evidence\nA finding ");
    expect(result.complete).toBe("## Evidence\nA finding ");
    expect(parseDraftBlockStart("## Evidence")).toEqual({ level: 2, text: "Evidence" });
    expect(parseDraftBlockStart("### Limitation")).toEqual({ level: 3, text: "Limitation" });
    expect(parseDraftBlockStart("A finding ")).toEqual({ level: null, text: "A finding " });
  });
});
