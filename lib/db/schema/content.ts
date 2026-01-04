import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { project } from "./project";
import { content_type } from "./content_type";
import { user } from "./auth";
import { uuidv7 } from "uuidv7"

export const content = sqliteTable("content", {
    id: text().primaryKey().$default(() => uuidv7()),
    project_id: text().notNull().references(() => project.id, { onDelete: "cascade" }),
    content_type_id: text().notNull().references(() => content_type.id, { onDelete: "cascade" }),
    title: text().notNull(),
    slug: text().notNull(),
    data: text({ mode: "json" }).notNull(), // Flexible JSON content
    status: text().default("draft").notNull(), // draft, published, archived
    created_by_id: text().notNull().references(() => user.id, { onDelete: "set null" }),
    updated_by_id: text().references(() => user.id, { onDelete: "set null" }),
    published_at: int(),
    created_at: int().notNull().$default(() => Date.now()),
    updated_at: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
  },
  (table) => [
    unique("content_project_slug_unique").on(table.project_id, table.slug),
    index("content_project_idx").on(table.project_id),
    index("content_status_idx").on(table.status),
    index("content_published_idx").on(table.published_at),
  ]
);
