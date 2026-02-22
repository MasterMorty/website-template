import { readFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    // Read the index.md file from the content folder
    const contentPath = join(process.cwd(), 'content', 'index.md');
    const content = await readFile(contentPath, 'utf-8');
    
    return {
      success: true,
      content,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read content file',
    });
  }
});
