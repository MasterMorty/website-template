import { sqliteTable, text, int, index } from "drizzle-orm/sqlite-core";
import { project } from "./project";
import { uuidv7 } from "uuidv7"

export const api_token = sqliteTable("api_token", {
    id: text().primaryKey().$default(() => uuidv7()),
    project_id: text().notNull().references(() => project.id, { onDelete: "cascade" }),
    name: text().notNull(),
    token_hash: text().notNull().unique(),
    scopes: text({ mode: "json" }).$type<string[]>().notNull(), // ["content:read", "media:read"]
    last_used_at: int(),
    expires_at: int(),
    created_at: int().notNull().$default(() => Date.now()),
  },
  (table) => [
    index("api_token_project_idx").on(table.project_id),
  ]
);
