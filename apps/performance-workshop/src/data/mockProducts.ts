import type { Product } from "../types";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Food",
  "Beauty",
];
const ADJECTIVES = [
  "Premium",
  "Deluxe",
  "Essential",
  "Pro",
  "Ultra",
  "Classic",
  "Modern",
  "Smart",
  "Portable",
  "Compact",
];
const NOUNS = [
  "Widget",
  "Gadget",
  "Tool",
  "Kit",
  "Bundle",
  "Pack",
  "Set",
  "Collection",
  "Device",
  "Module",
];
const TAGS = [
  "sale",
  "new",
  "bestseller",
  "trending",
  "limited",
  "exclusive",
  "eco",
  "organic",
  "refurbished",
  "handmade",
];

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 0x100000000;
  };
}

export const ALL_PRODUCTS: Product[] = Array.from({ length: 5000 }, (_, i) => {
  const rand = lcg(i + 42);
  const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
  const adjective = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(rand() * NOUNS.length)];

  const tagCount = Math.floor(rand() * 3) + 1;
  const tags = [
    ...new Set(Array.from({ length: tagCount }, () => TAGS[Math.floor(rand() * TAGS.length)])),
  ];

  return {
    id: `prod-${i + 1}`,
    name: `${adjective} ${noun} ${i + 1}`,
    category,
    price: Math.round((rand() * 490 + 10) * 100) / 100,
    rating: Math.round((rand() * 4 + 1) * 10) / 10,
    reviewCount: Math.floor(rand() * 9999) + 1,
    inStock: rand() > 0.2,
    tags,
  };
});

export const CATEGORY_LIST = [...new Set(ALL_PRODUCTS.map((p) => p.category))].sort();
