import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'data',
      source: 'pages/**/*.json',
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        sections: z.array(
          z.object({
            id: z.string(),
            component: z.string(),
            props: z.record(z.any())
          })
        ),
        meta: z.object({
          description: z.string().optional(),
          ogImage: z.string().optional()
        }).optional(),
        published: z.boolean().default(true),
        updatedAt: z.string()
      })
    })
  }
})
