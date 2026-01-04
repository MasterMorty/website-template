import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { roles } from "./roles";
import { uuidv7 } from "uuidv7"

export const permissions = sqliteTable(
  "permissions",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    role_id: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    resource: text("resource").notNull(), // projects, content, media, components, users
    action: text("action").notNull(), // create, read, update, delete
    created_at: int("created_at").notNull().$default(() => Date.now()),
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
