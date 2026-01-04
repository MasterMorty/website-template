import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { project } from "./project";
import { uuidv7 } from "uuidv7"

export const content_type = sqliteTable("content_type", {
    id: text().primaryKey().$default(() => uuidv7()),
    project_id: text().notNull().references(() => project.id, { onDelete: "cascade" }),
    name: text().notNull(), // Blog, Article, Page
    slug: text().notNull(),
    description: text(),
    schema: text({ mode: "json" }).notNull(), // JSON schema for fields
    created_at: int().notNull().$default(() => Date.now()),
  },
  (table) => [
    unique("content_type_project_slug_unique").on(table.project_id, table.slug),
    index("content_type_project_idx").on(table.project_id),
  ]
);
