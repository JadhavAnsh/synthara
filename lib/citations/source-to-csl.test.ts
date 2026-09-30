import { describe, expect, it } from "vitest";

import { sourceToCslJson } from "@/lib/citations/source-to-csl";

describe("sourceToCslJson", () => {
  it("maps academic sources to article-journal", () => {
    const result = sourceToCslJson({
      title: "Attention is all you need",
      authors: ["Vaswani", "Shazeer"],
      url: "https://example.com/paper",
      sourceType: "academic",
    });

    expect(result.type).toBe("article-journal");
    expect(result.title).toBe("Attention is all you need");
    expect(result.author).toEqual([{ literal: "Vaswani" }, { literal: "Shazeer" }]);
  });

  it("maps web sources to webpage", () => {
    const result = sourceToCslJson({
      title: "Example article",
      authors: [],
      url: "https://example.com",
      sourceType: "web",
    });

    expect(result.type).toBe("webpage");
  });
});
