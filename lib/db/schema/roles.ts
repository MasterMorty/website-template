import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { organizations } from "./organizations";
import { uuidv7 } from "uuidv7"

export const roles = sqliteTable(
  "roles",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    org_id: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // admin, editor, viewer, custom roles
    description: text("description"),
    is_system: int("is_system", { mode: "boolean" }).default(false).notNull(),
    created_at: int("created_at").notNull().$default(() => Date.now()),
  },
  (table) => [
    unique("role_org_name_unique").on(table.org_id, table.name),
    index("role_org_idx").on(table.org_id),
  ]
);
