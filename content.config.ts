import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
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
    })
  }
})
