import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { project } from "./project";
import { user } from "./auth";
import { role } from "./role";
import { uuidv7 } from "uuidv7"

export const project_member = sqliteTable("project_member", {
    id: text().primaryKey().$default(() => uuidv7()),
    project_id: text().notNull().references(() => project.id, { onDelete: "cascade" }),
    user_id: text().notNull().references(() => user.id, { onDelete: "cascade" }),
    role_id: text().notNull().references(() => role.id, { onDelete: "restrict" }),
    added_at: int().notNull().$default(() => Date.now()),
  },
  (table) => [
    unique("proj_member_project_user_unique").on(
      table.project_id,
      table.user_id
    ),
    index("proj_member_project_idx").on(table.project_id),
    index("proj_member_user_idx").on(table.user_id),
  ]
);
