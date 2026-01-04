import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { role } from "./role";
import { uuidv7 } from "uuidv7"

export const permission = sqliteTable("permission", {
    id: text().primaryKey().$default(() => uuidv7()),
    role_id: text().notNull().references(() => role.id, { onDelete: "cascade" }),
    resource: text().notNull(), // projects, content, media, components, users
    action: text().notNull(), // create, read, update, delete
    created_at: int().notNull().$default(() => Date.now()),
  },
  (table) => [
    unique("perm_role_resource_action_unique").on(
      table.role_id,
      table.resource,
      table.action
    ),
    index("perm_role_idx").on(table.role_id),
  ]
);
