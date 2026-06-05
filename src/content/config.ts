import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('General'),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    coverImage: z.string().optional(),
  }),
});

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('Notes'),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = {
  blog: blogCollection,
  docs: docsCollection,
};