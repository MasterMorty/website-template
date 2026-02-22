import { writeFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    if (!body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content is required',
      });
    }

    const contentPath = join(process.cwd(), 'content', 'index.md');
    await writeFile(contentPath, body.content, 'utf-8');
    
    return {
      success: true,
      message: 'Content saved successfully',
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save content file' + (error instanceof Error ? `: ${error.message}` : ''),
    });
  }
});
