import { sqliteTable, text, int, index } from "drizzle-orm/sqlite-core";
import { projects } from "./projects";
import { users } from "./users";
import { uuidv7 } from "uuidv7"

export const media = sqliteTable(
  "media",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    project_id: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    file_name: text("file_name").notNull(),
    mime_type: text("mime_type").notNull(),
    file_size: int("file_size").notNull(),
    storage_path: text("storage_path").notNull(), // e.g., projects/{project_id}/media/{filename}
    public_url: text("public_url").notNull(),
    width: int("width"), // for images
    height: int("height"), // for images
    tags: text("tags", { mode: "json" }).$type<string[]>().$default(() => []).notNull(), // ["hero", "gallery", "thumbnail"]
    alt_text: text("alt_text"),
    uploaded_by_id: text("uploaded_by_id").notNull().references(() => users.id, { onDelete: "set null" }),
    created_at: int("created_at").notNull().$default(() => Date.now()),
  },
  (table) => [
    index("media_project_idx").on(table.project_id),
  ]
);
