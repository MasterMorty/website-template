import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        num: z.string(),
        name: z.string(),
        type: z.string(),
        tags: z.array(z.string()),
        desc: z.string(),
        img: z.string(),
        logo: z.string(),
        url: z.string(),
        color: z.string(),
        date: z.string(),
        order: z.number(),
        featured: z.boolean().optional(),
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        icon: z.string().optional(),
      })
    }),
    hubPages: defineCollection({
      type: 'page',
      source: 'hub/*.md',
      schema: z.object({
        icon: z.string().optional(),
      })
    }),
    hubAdminPages: defineCollection({
      type: 'page',
      source: 'hub/admin/*.md',
      schema: z.object({
        icon: z.string().optional(),
      })
    }),
    hubSuperadminPages: defineCollection({
      type: 'page',
      source: 'hub/superadmin/*.md',
      schema: z.object({
        icon: z.string().optional(),
      })
    }),
  }
})
