import type { MenuCategoryData, MenuItem, MenuSubgroup } from "../data/menu";
import { parsePrice } from "./parsePrice";

export function buildMenuJsonLd(categories: MenuCategoryData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Elysian – Sorsi di Poesia",
    hasMenuSection: categories.map(categoryToSection),
  };
}

function categoryToSection(category: MenuCategoryData) {
  const namedSubgroups = category.subgroups.filter((sg) => sg.title);
  const unnamedSubgroups = category.subgroups.filter((sg) => !sg.title);

  const section: Record<string, unknown> = {
    "@type": "MenuSection",
    name: category.title,
  };

  if (namedSubgroups.length > 0) {
    section.hasMenuSection = namedSubgroups.map(subgroupToSection);
  }

  const directItems = unnamedSubgroups.flatMap((sg) => sg.items);
  if (directItems.length > 0) {
    section.hasMenuItem = directItems.map(itemToJsonLd);
  }

  return section;
}

function subgroupToSection(subgroup: MenuSubgroup) {
  const section: Record<string, unknown> = {
    "@type": "MenuSection",
    name: subgroup.title,
    hasMenuItem: subgroup.items.map(itemToJsonLd),
  };
  if (subgroup.note) {
    section.description = subgroup.note;
  }
  return section;
}

function itemToJsonLd(item: MenuItem) {
  return {
    "@type": "MenuItem",
    name: item.name,
    ...(item.description ? { description: item.description } : {}),
    offers: {
      "@type": "Offer",
      price: parsePrice(item.price),
      priceCurrency: "EUR",
    },
  };
}
