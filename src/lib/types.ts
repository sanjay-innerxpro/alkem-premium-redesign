export const collections = [
  "pages",
  "products",
  "offerings",
  "therapies",
  "news",
  "careers",
] as const;
export type Collection = (typeof collections)[number];
export type Content = {
  id: string;
  collection: Collection;
  slug: string;
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  category: string;
  location: string;
  employmentType: string;
  composition: string;
  dosageForm: string;
  packSize: string;
  /** Display text, e.g. "₹70 per box". */
  price: string;
  /** Minimum order quantity, e.g. "300 boxes". */
  moq: string;
  /** Untranslated category, used for filtering and URLs when a language is active. */
  categoryKey?: string;
  published: boolean;
  sortOrder: number;
  updatedAt?: string;
};
export const socialNetworks = [
  "linkedin",
  "instagram",
  "facebook",
  "x",
  "youtube",
] as const;
export type SocialNetwork = (typeof socialNetworks)[number];
export type Section = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
};
export type Settings = {
  brand: string;
  tagline: string;
  /** Logo symbol shown on a white tile; empty uses the brand initial. */
  logoUrl: string;
  /** Shown with the product catalogue and on every product. */
  productsNote: string;
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  heroCta: string;
  heroImage: string;
  established: string;
  purpose: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  social: Record<SocialNetwork, string>;
  metrics: { value: string; label: string }[];
  sections: Record<
    | "about"
    | "products"
    | "offerings"
    | "innovation"
    | "therapies"
    | "impact"
    | "sustainability"
    | "careers"
    | "news"
    | "contact",
    Section
  >;
};
export type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "resolved";
  createdAt: string;
};
