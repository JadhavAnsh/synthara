export function splitCompleteWords(pending: string, chunk: string) {
  const text = pending + chunk;
  const lastBoundary = Math.max(text.lastIndexOf(" "), text.lastIndexOf("\n"), text.lastIndexOf("\t"));

  return lastBoundary < 0
    ? { complete: "", pending: text }
    : { complete: text.slice(0, lastBoundary + 1), pending: text.slice(lastBoundary + 1) };
}

export function parseDraftBlockStart(text: string) {
  const heading = /^(#{2,3})[ \t]+/.exec(text);
  return {
    level: heading ? heading[1].length : null,
    text: heading ? text.slice(heading[0].length) : text,
  };
}
