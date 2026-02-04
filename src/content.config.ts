import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Hybrid schema that accepts both existing frontmatter AND AstroPaper fields
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      // Existing fields
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.string().optional(),
      category: z.string().optional(),
      source: z.string().optional(),
      original_file: z.string().optional(),
      original_id: z.number().optional(),
      slug: z.string().optional(),
      // AstroPaper fields (optional for backwards compatibility)
      author: z.string().optional(),
      pubDatetime: z.coerce.date().optional(), // AstroPaper uses this instead of pubDate
      modDatetime: z.coerce.date().optional().nullable(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
      ogImage: image().or(z.string()).optional(),
      canonicalURL: z.string().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.string().optional(),
    source: z.string().optional(),
    slug: z.string().optional(),
  }),
});

const legacy = defineCollection({
  loader: glob({ base: "./src/content/legacy", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.string().optional(),
    source: z.string().optional(),
    original_file: z.string().optional(),
    original_id: z.number().optional(),
    slug: z.string().optional(),
  }),
});

export const collections = { blog, pages, legacy };
