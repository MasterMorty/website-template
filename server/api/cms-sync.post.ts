import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    // 1. Verify API Key
    const apiKey = getHeader(event, 'X-API-Key')
    const expectedApiKey = process.env.CMS_API_KEY
    
    if (!expectedApiKey) {
      throw createError({
        statusCode: 500,
        message: 'CMS_API_KEY not configured on this site'
      })
    }
    
    if (!apiKey || apiKey !== expectedApiKey) {
      throw createError({
        statusCode: 401,
        message: 'Invalid or missing API key'
      })
    }

    // 2. Get request body
    const body = await readBody(event)
    
    // 3. Verify signature (HMAC-SHA256)
    const signature = getHeader(event, 'X-Signature')
    const webhookSecret = process.env.CMS_WEBHOOK_SECRET
    
    if (!webhookSecret) {
      throw createError({
        statusCode: 500,
        message: 'CMS_WEBHOOK_SECRET not configured on this site'
      })
    }
    
    if (!signature) {
      throw createError({
        statusCode: 401,
        message: 'Missing signature'
      })
    }
    
    // Compute expected signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex')
    
    if (signature !== expectedSignature) {
      throw createError({
        statusCode: 401,
        message: 'Invalid signature'
      })
    }

    // 4. Verify timestamp (prevent replay attacks - 5 minute window)
    const timestamp = body.timestamp
    if (!timestamp) {
      throw createError({
        statusCode: 400,
        message: 'Missing timestamp'
      })
    }
    
    const now = Date.now()
    const requestTime = new Date(timestamp).getTime()
    const timeDiff = Math.abs(now - requestTime)
    
    if (timeDiff > 5 * 60 * 1000) { // 5 minutes
      throw createError({
        statusCode: 401,
        message: 'Request timestamp too old'
      })
    }

    // 5. Process the sync data
    const { action, data } = body
    
    switch (action) {
      case 'update_page':
        await updatePage(data)
        break
      case 'delete_page':
        await deletePage(data)
        break
      case 'update_multiple_pages':
        await updateMultiplePages(data)
        break
      default:
        throw createError({
          statusCode: 400,
          message: `Unknown action: ${action}`
        })
    }

    return {
      success: true,
      message: `Action '${action}' completed successfully`,
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    console.error('CMS Sync Error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal server error'
    })
  }
})

// Helper function to update a single page
async function updatePage(data: any) {
  const { slug, pageData } = data
  
  if (!slug || !pageData) {
    throw createError({
      statusCode: 400,
      message: 'Missing slug or pageData'
    })
  }

  // Ensure the content/pages directory exists
  const contentDir = path.join(process.cwd(), 'content', 'pages')
  await fs.mkdir(contentDir, { recursive: true })
  
  // Write the page data to a JSON file
  const filePath = path.join(contentDir, `${slug}.json`)
  await fs.writeFile(filePath, JSON.stringify(pageData, null, 2), 'utf-8')
  
  console.log(`Updated page: ${slug}`)
}

// Helper function to delete a page
async function deletePage(data: any) {
  const { slug } = data
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Missing slug'
    })
  }

  const filePath = path.join(process.cwd(), 'content', 'pages', `${slug}.json`)
  
  try {
    await fs.unlink(filePath)
    console.log(`Deleted page: ${slug}`)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, that's ok
      console.log(`Page ${slug} doesn't exist, skipping delete`)
    } else {
      throw error
    }
  }
}

// Helper function to update multiple pages at once
async function updateMultiplePages(data: any) {
  const { pages } = data
  
  if (!Array.isArray(pages)) {
    throw createError({
      statusCode: 400,
      message: 'pages must be an array'
    })
  }

  for (const pageData of pages) {
    await updatePage(pageData)
  }
  
  console.log(`Updated ${pages.length} pages`)
}
