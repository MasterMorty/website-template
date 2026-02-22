import db from '~~/lib/db'
import { media } from '~~/lib/db/schema'
import { auth } from '~~/lib/auth'
import { uuidv7 } from 'uuidv7'
import env from '~~/lib/env'
 
export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const formData = await readFormData(event)
  const file = formData.get('file') as File
  const projectId = formData.get('projectId') as string
  const altText = (formData.get('altText') as string) || ''

  if (!file || !projectId) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }

  const storage = useStorage('r2')

  // Generate unique filename
  const fileId = uuidv7()
  const fileExt = file.name.split('.').pop()
  const fileName = `${fileId}.${fileExt}`
  const storagePath = `projects/${projectId}/media/${fileName}`

  // Upload to R2 using Nuxt storage
  const arrayBuffer = await file.arrayBuffer()
  await storage.setItemRaw(storagePath, new Uint8Array(arrayBuffer))

  // Get image dimensions if it's an image
  const width: number | null = null
  const height: number | null = null
  
  if (file.type.startsWith('image/')) {
    // For images, we'll set dimensions on the client side or use a library
    // For now, we'll leave them null and can be updated later
  }

  const publicUrl = `${env.R2_PUBLIC_URL}/${storagePath}`

  // Save to database
  const [mediaRecord] = await db.insert(media).values({
    id: fileId,
    project_id: projectId,
    name: file.name,
    file_name: fileName,
    mime_type: file.type,
    file_size: file.size,
    storage_path: storagePath,
    public_url: publicUrl,
    width,
    height,
    alt_text: altText,
    uploaded_by_id: session.user.id,
  }).returning()

  return mediaRecord
})
