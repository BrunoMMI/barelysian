export function parsePrice(raw: string): number {
  const match = raw.match(/\d+(?:\.\d+)?/);
  if (!match) {
    throw new Error(`Cannot parse a numeric price from "${raw}"`);
  }
  return Number.parseFloat(match[0]);
}
