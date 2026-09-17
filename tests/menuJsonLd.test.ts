import { describe, expect, it } from "vitest";
import { buildMenuJsonLd } from "../src/lib/menuJsonLd";
import { menuCategories } from "../src/data/menu";

describe("buildMenuJsonLd", () => {
  it("wraps the menu in a schema.org Menu type", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    expect(jsonld["@context"]).toBe("https://schema.org");
    expect(jsonld["@type"]).toBe("Menu");
  });

  it("creates one MenuSection per top-level category", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    expect(jsonld.hasMenuSection).toHaveLength(menuCategories.length);
  });

  it("nests named subgroups as their own MenuSection with priced items", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    const drinkList = jsonld.hasMenuSection.find((s: any) => s.name === "Drink List");
    const spritz = drinkList.hasMenuSection.find((s: any) => s.name === "Spritz");
    expect(spritz.hasMenuItem).toHaveLength(8);
    expect(spritz.hasMenuItem[0].offers.price).toBe(5);
    expect(spritz.hasMenuItem[0].offers.priceCurrency).toBe("EUR");
  });

  it("lists items directly on categories with no subgroup titles", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    const caffetteria = jsonld.hasMenuSection.find((s: any) => s.name === "Caffetteria");
    expect(caffetteria.hasMenuItem.length).toBeGreaterThan(0);
    expect(caffetteria.hasMenuSection).toBeUndefined();
  });

  it("carries a subgroup note as the nested section's description", () => {
    const jsonld = buildMenuJsonLd(menuCategories) as any;
    const gelati = jsonld.hasMenuSection.find((s: any) => s.name === "Gelati");
    expect(gelati.hasMenuItem.some((item: any) => item.name.startsWith("Cono"))).toBe(true);
  });
});
