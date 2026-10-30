import { defaultContent } from "./defaults";
import type { Content } from "./types";
// The company product list from defaults.ts. Its rows use the sample-product ids
// (product-0, product-1, …), so loading it replaces the original sample products and never
// touches products added in the Content Studio.
export const catalogue = defaultContent.filter(
  (x) => x.collection === "products",
);
export const isSampleProduct = (id: string) => /^product-\d+$/.test(id);
export const catalogueMissing = (items: Content[]) =>
  catalogue.some(
    (c) => !items.some((x) => x.id === c.id && x.slug === c.slug),
  ) ||
  items.some(
    (x) => isSampleProduct(x.id) && !catalogue.some((c) => c.id === x.id),
  );
