import db from "~~/lib/db";
import { auth } from "~~/lib/auth";
import { project } from "~~/lib/db/schema";
import { uuidv7 } from "uuidv7";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    const user = session?.user;
    const orgId = session?.session?.activeOrganizationId ?? user?.org_id;

    if (!user) {
        throw createError({ statusCode: 401, message: 'Unauthorized' });
    }

    if (!orgId) {
        throw createError({ statusCode: 400, message: 'No active organization' });
    }

    const body = await readBody(event);

    const newProject = await db
        .insert(project)
        .values({
            id: uuidv7(),
            org_id: orgId,
            name: body.name,
            slug: body.slug,
            description: body.description,
            created_by_id: user.id,
            created_at: Date.now(),
            updated_at: Date.now(),
        })
        .returning();

    return newProject[0];
});
