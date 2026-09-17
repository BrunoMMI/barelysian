import { describe, expect, it } from "vitest";
import { parsePrice } from "../src/lib/parsePrice";

describe("parsePrice", () => {
  it("parses a simple decimal price", () => {
    expect(parsePrice("1.10€")).toBe(1.1);
  });

  it("parses a price with no decimal", () => {
    expect(parsePrice("5€")).toBe(5);
  });

  it("takes the first price when two are given", () => {
    expect(parsePrice("2.00€ / 2.50€")).toBe(2);
  });

  it("throws when no number is present", () => {
    expect(() => parsePrice("gratis")).toThrow();
  });
});
