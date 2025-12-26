#!/usr/bin/env node
import crypto from 'crypto'

/**
 * Example script showing how your CMS should call the webhook endpoint
 * to sync page updates to the customer's site.
 */

// Configuration - these would come from your CMS database
const config = {
  customerSiteUrl: 'http://localhost:3000', // Customer's site URL
  apiKey: 'your-secure-api-key-here',
  webhookSecret: 'your-webhook-secret-here'
}

// Example page data to sync
const pageData = {
  title: 'New Product Page',
  slug: 'products',
  sections: [
    {
      id: 'hero-products',
      component: 'HeroSection',
      props: {
        headline: 'Our Amazing Products',
        subheadline: 'Discover what we have to offer',
        ctaText: 'View Products',
        ctaLink: '#products'
      }
    },
    {
      id: 'products-grid',
      component: 'FeatureGrid',
      props: {
        title: 'Featured Products',
        columns: 3,
        features: [
          {
            icon: '📱',
            title: 'Product 1',
            description: 'An amazing product that solves your problems'
          },
          {
            icon: '💻',
            title: 'Product 2',
            description: 'Another great product for your needs'
          },
          {
            icon: '⌚',
            title: 'Product 3',
            description: 'The best product in its category'
          }
        ]
      }
    }
  ],
  meta: {
    description: 'Check out our amazing product lineup',
    ogImage: ''
  },
  published: true,
  updatedAt: new Date().toISOString()
}

// Create the request payload
const payload = {
  timestamp: new Date().toISOString(),
  action: 'update_page',
  data: {
    slug: pageData.slug,
    pageData: pageData
  }
}

// Generate HMAC signature
const signature = crypto
  .createHmac('sha256', config.webhookSecret)
  .update(JSON.stringify(payload))
  .digest('hex')

// Make the request
console.log('🚀 Sending webhook to customer site...')
console.log(`URL: ${config.customerSiteUrl}/api/cms-sync`)
console.log(`Slug: ${pageData.slug}`)
console.log(`Sections: ${pageData.sections.length}`)
console.log('')

fetch(`${config.customerSiteUrl}/api/cms-sync`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': config.apiKey,
    'X-Signature': signature
  },
  body: JSON.stringify(payload)
})
  .then(async (response) => {
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Success!')
      console.log(data)
    } else {
      console.log('❌ Error!')
      console.log(`Status: ${response.status}`)
      console.log(data)
    }
  })
  .catch((error) => {
    console.error('❌ Request failed:', error.message)
  })
