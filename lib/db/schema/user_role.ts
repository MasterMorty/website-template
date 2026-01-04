import { sqliteTable, text, primaryKey, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { role } from "./role";

export const user_role = sqliteTable("user_role", {
    user_id: text().notNull().references(() => user.id, { onDelete: "cascade" }),
    role_id: text().notNull().references(() => role.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.user_id, table.role_id] }),
    index("user_role_user_idx").on(table.user_id),
    index("user_role_role_idx").on(table.role_id),
  ]
);
