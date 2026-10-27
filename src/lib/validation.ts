import { z } from "zod";
import { collections } from "./types";
export const safeImage = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (v) =>
      !v ||
      (/^\/(?!\/)/.test(v) && !v.includes("\\")) ||
      /^https:\/\/[^\s]+$/i.test(v),
    "Use an HTTPS URL or a local /image.svg path.",
  );
const text = (max: number) => z.string().trim().max(max);
export const contentSchema = z
  .object({
    id: text(64),
    collection: z.enum(collections),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(160)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase words separated by hyphens.",
      ),
    title: text(180).min(1),
    summary: text(600),
    body: text(30000),
    imageUrl: safeImage,
    category: text(100),
    location: text(150),
    employmentType: z.enum([
      "",
      "Full-time",
      "Part-time",
      "Contract",
      "Internship",
    ]),
    published: z.boolean(),
    sortOrder: z.coerce.number().int().min(0).max(9999),
  })
  .refine(
    (x) =>
      x.collection !== "pages" ||
      ![
        "admin",
        "api",
        "offerings",
        "therapies",
        "news",
        "careers",
        "contact",
        "privacy",
        "pages",
      ].includes(x.slug),
    {
      message: "This page slug is reserved by the application.",
      path: ["slug"],
    },
  );
const section = z.object({
  eyebrow: text(100),
  title: text(200).min(1),
  description: text(1500),
  imageUrl: safeImage,
});
export const settingsSchema = z.object({
  brand: text(40).min(1),
  tagline: text(120),
  seoTitle: text(180).min(1),
  seoDescription: text(320),
  heroEyebrow: text(150),
  heroTitle: text(200).min(1),
  heroAccent: text(200),
  heroDescription: text(1000),
  heroCta: text(100).min(1),
  heroImage: safeImage,
  established: text(20),
  purpose: text(150),
  footerText: text(500),
  contactEmail: z.union([z.literal(""), z.email()]),
  contactPhone: text(40).regex(/^[+0-9 ()-]*$/),
  contactAddress: text(500),
  metrics: z
    .array(z.object({ value: text(30).min(1), label: text(100).min(1) }))
    .length(4),
  sections: z.object({
    about: section,
    offerings: section,
    innovation: section,
    therapies: section,
    impact: section,
    sustainability: section,
    careers: section,
    news: section,
    contact: section,
  }),
});
export const enquirySchema = z.object({
  name: text(100).min(2),
  email: z.email().max(254),
  subject: text(180).min(2),
  message: text(5000).min(10),
  website: text(200).optional(),
  jobId: text(64).optional(),
});
