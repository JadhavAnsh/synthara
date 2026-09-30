import { describe, expect, it } from "vitest";

import { parseArxivEntriesForTest } from "@/lib/search/providers/arxiv";

describe("parseArxivEntries", () => {
  it("parses atom entries and extracts metadata", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Attention Is All You Need</title>
    <id>https://arxiv.org/abs/1706.03762</id>
    <summary>Authors: Ashish Vaswani, Noam Shazeer

Abstract:
We propose a new architecture.</summary>
  </entry>
</feed>`;

    const results = parseArxivEntriesForTest(xml);
    expect(results).toHaveLength(1);
    expect(results[0]?.title).toBe("Attention Is All You Need");
    expect(results[0]?.authors).toEqual(["Ashish Vaswani", "Noam Shazeer"]);
    expect(results[0]?.externalId).toBe("arxiv:1706.03762");
    expect(results[0]?.snippets[0]).toContain("new architecture");
  });
});
