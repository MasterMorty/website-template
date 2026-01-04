import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { organization } from "./organization";
import { uuidv7 } from "uuidv7"

export const role = sqliteTable("roles", {
    id: text().primaryKey().$default(() => uuidv7()),
    org_id: text().notNull().references(() => organization.id, { onDelete: "cascade" }),
    name: text().notNull(), // admin, editor, viewer, custom roles
    description: text(),
    is_system: int({ mode: "boolean" }).default(false).notNull(),
    created_at: int().notNull().$default(() => Date.now()),
  },
  (table) => [
    unique("role_org_name_unique").on(table.org_id, table.name),
    index("role_org_idx").on(table.org_id),
  ]
);
