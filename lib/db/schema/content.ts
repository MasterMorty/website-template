import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { projects } from "./projects";
import { content_types } from "./content_types";
import { users } from "./users";
import { uuidv7 } from "uuidv7"

export const content = sqliteTable(
  "content",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    project_id: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    content_type_id: text("content_type_id").notNull().references(() => content_types.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    data: text("data", { mode: "json" }).notNull(), // Flexible JSON content
    status: text("status").default("draft").notNull(), // draft, published, archived
    created_by_id: text("created_by_id").notNull().references(() => users.id, { onDelete: "set null" }),
    updated_by_id: text("updated_by_id").references(() => users.id, { onDelete: "set null" }),
    published_at: int("published_at"),
    created_at: int("created_at").notNull().$default(() => Date.now()),
    updated_at: int("updated_at").notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
  },
  (table) => [
    unique("content_project_slug_unique").on(table.project_id, table.slug),
    index("content_project_idx").on(table.project_id),
    index("content_status_idx").on(table.status),
    index("content_published_idx").on(table.published_at),
  ]
);
