import { auth } from "~~/lib/auth";
import db from "~~/lib/db";
import { project } from "~~/lib/db/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user;
  const orgId = session?.session?.activeOrganizationId ?? user?.org_id;

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const projectId = getRouterParam(event, "projectId");

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  try {
    const [projectData] = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, projectId),
          ...(orgId ? [eq(project.org_id, orgId)] : []),
          eq(project.status, "active")
        )
      );

    if (!projectData) {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    return projectData;
  } catch (error: any) {
    if (error?.statusCode) throw error;

    console.error("Failed to fetch project:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch project",
    });
  }
});