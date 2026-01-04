import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { projects } from "./projects";
import { users } from "./users";
import { roles } from "./roles";
import { uuidv7 } from "uuidv7"

export const project_members = sqliteTable(
  "project_members",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    project_id: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role_id: text("role_id").notNull().references(() => roles.id, { onDelete: "restrict" }),
    added_at: int("added_at").notNull().$default(() => Date.now()),
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
