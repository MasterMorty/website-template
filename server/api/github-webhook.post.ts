import crypto from 'crypto'

/**
 * GitHub Webhook Handler
 * 
 * This endpoint receives webhooks from GitHub when the customer's repo changes.
 * Your CMS should listen to this to re-sync component schemas when they're updated.
 * 
 * Set this URL in GitHub repo settings:
 * Webhooks → Add webhook → Payload URL: https://your-cms.com/api/github-webhook
 */

export default defineEventHandler(async (event) => {
  try {
    // 1. Verify GitHub signature
    const signature = getHeader(event, 'X-Hub-Signature-256')
    const githubSecret = process.env.GITHUB_WEBHOOK_SECRET
    
    if (!githubSecret) {
      throw createError({
        statusCode: 500,
        message: 'GITHUB_WEBHOOK_SECRET not configured'
      })
    }
    
    const body = await readRawBody(event, 'utf-8')
    
    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'No body provided'
      })
    }
    
    // Verify signature
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', githubSecret)
      .update(body)
      .digest('hex')
    
    if (signature !== expectedSignature) {
      throw createError({
        statusCode: 401,
        message: 'Invalid signature'
      })
    }

    // 2. Parse webhook payload
    const payload = JSON.parse(body)
    const event_type = getHeader(event, 'X-GitHub-Event')
    
    console.log('📥 GitHub webhook received:', event_type)
    
    // 3. Handle push events (component changes)
    if (event_type === 'push') {
      const commits = payload.commits || []
      const componentFiles = []
      
      // Check if any component files were modified
      for (const commit of commits) {
        const modified = [
          ...(commit.added || []),
          ...(commit.modified || []),
          ...(commit.removed || [])
        ]
        
        for (const file of modified) {
          if (file.startsWith('app/components/') && file.endsWith('.vue')) {
            componentFiles.push(file)
          }
        }
      }
      
      if (componentFiles.length > 0) {
        console.log('🔄 Component files changed:', componentFiles)
        
        // In your CMS, you would:
        // 1. Pull the latest code from GitHub
        // 2. Re-run component discovery
        // 3. Update component schemas in your database
        // 4. Notify the visual editor to refresh
        
        return {
          success: true,
          message: 'Component changes detected',
          files: componentFiles,
          action: 'resync_required'
        }
      }
    }

    return {
      success: true,
      message: 'Webhook received',
      event: event_type
    }
    
  } catch (error: any) {
    console.error('GitHub Webhook Error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal server error'
    })
  }
})
