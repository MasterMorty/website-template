import { sqliteTable, text, primaryKey, index } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { roles } from "./roles";

export const user_roles = sqliteTable(
  "user_roles",
  {
    user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role_id: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.user_id, table.role_id] }),
    index("user_role_user_idx").on(table.user_id),
    index("user_role_role_idx").on(table.role_id),
  ]
);
