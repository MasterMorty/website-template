import { sqliteTable, text, int, index } from "drizzle-orm/sqlite-core";
import { project } from "./project";
import { user } from "./auth";
import { uuidv7 } from "uuidv7"

export const media = sqliteTable( "media", {
    id: text().primaryKey().$default(() => uuidv7()),
    project_id: text().notNull().references(() => project.id, { onDelete: "cascade" }),
    name: text().notNull(),
    file_name: text().notNull(),
    mime_type: text().notNull(),
    file_size: int().notNull(),
    storage_path: text().notNull(), // e.g., projects/{project_id}/media/{filename}
    public_url: text().notNull(),
    width: int(), // for images
    height: int(), // for images
    tags: text({ mode: "json" }).$type<string[]>().$default(() => []).notNull(), // ["hero", "gallery", "thumbnail"]
    alt_text: text().notNull(),
    uploaded_by_id: text().notNull().references(() => user.id, { onDelete: "set null" }),
    created_at: int().notNull().$default(() => Date.now()),
  },
  (table) => [
    index("media_project_idx").on(table.project_id),
  ]
);
