import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
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