import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      category: z.string().optional(),
      source: z.string().optional(),
      original_file: z.string().optional(),
      original_id: z.number().optional(),
      slug: z.string().optional(),
    }),
});

export const collections = { blog };
