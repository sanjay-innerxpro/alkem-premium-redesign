export const collections = [
  "pages",
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
  published: boolean;
  sortOrder: number;
  updatedAt?: string;
};
export type Section = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
};
export type Settings = {
  brand: string;
  tagline: string;
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
  metrics: { value: string; label: string }[];
  sections: Record<
    | "about"
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
