import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { projects } from "./projects";
import { uuidv7 } from "uuidv7"

export const content_types = sqliteTable(
  "content_types",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    project_id: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // Blog, Article, Page
    slug: text("slug").notNull(),
    description: text("description"),
    schema: text("schema", { mode: "json" }).notNull(), // JSON schema for fields
    created_at: int("created_at").notNull().$default(() => Date.now()),
  },
  (table) => [
    unique("content_type_project_slug_unique").on(
      table.project_id,
      table.slug
    ),
    index("content_type_project_idx").on(table.project_id),
  ]
);
