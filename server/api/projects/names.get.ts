import { auth } from "~~/lib/auth";
import db from '~~/lib/db';
import { project } from '~~/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user;
  const orgId = session?.session?.activeOrganizationId ?? user?.org_id;

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  if (!orgId) {
    return [];
  }

  try {
    const projects = await db
      .select({ 
        id: project.id,
        name: project.name
       })
      .from(project)
      .where(
        and(
          eq(project.org_id, orgId), 
          eq(project.status, 'active')
        )
      );

    return projects;
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Failed to fetch project names' });
  }
});