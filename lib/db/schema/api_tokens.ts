import { sqliteTable, text, int, index } from "drizzle-orm/sqlite-core";
import { projects } from "./projects";
import { uuidv7 } from "uuidv7"

export const api_tokens = sqliteTable(
  "api_tokens",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    project_id: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    token_hash: text("token_hash").notNull().unique(),
    scopes: text("scopes", { mode: "json" }).$type<string[]>().notNull(), // ["content:read", "media:read"]
    last_used_at: int("last_used_at"),
    expires_at: int("expires_at"),
    created_at: int("created_at").notNull().$default(() => Date.now()),
  },
  (table) => [
    index("api_token_project_idx").on(table.project_id),
  ]
);
