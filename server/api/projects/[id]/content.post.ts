import { auth } from "~~/lib/auth"
import db from "~~/lib/db"
import { content } from "~~/lib/db/schema"

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers })
    const user = session?.user

    if (!user?.org_id || !user) {
        throw createError({ statusCode: 401, message: "Unauthorized" })
    }

    const projectId = getRouterParam(event, "id")

    if (!projectId) {
        throw createError({
            statusCode: 400,
            message: "Project ID is required",
        })
    }

    const body = await readBody(event)

    if (!body.title) {
        throw createError({
            statusCode: 400,
            message: "Title is required",
        })
    }

    try {
        const [created] = await db
            .insert(content)
            .values({
                project_id: projectId,
                content_type_id: body.content_type_id,
                title: body.title,
                slug: body.slug || slugify(body.title),
                data: body.data ?? {},
                status: body.status ?? "draft",
                cover_image_id: body.cover_image_id ?? null,
                created_by_id: user.id,
                updated_by_id: user.id,
                published_at: body.published_at ?? null,
            })
            .returning()

        return created
    } catch (error: any) {
        console.error("Failed to create content:", error)

        throw createError({
            statusCode: 500,
            message: "Failed to create content",
        })
    }
})

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}