import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { organizations } from "./organizations";
import { uuidv7 } from "uuidv7"

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    org_id: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name"),
    password_hash: text("password_hash").notNull(),
    avatar_url: text("avatar_url"),
    is_owner: int("is_owner", { mode: "boolean" }).default(false).notNull(),
    status: text("status").default("active").notNull(), // active, inactive, deleted
    created_at: int("created_at").notNull().$default(() => Date.now()),
    updated_at: int("updated_at").notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
  },
  (table) => [
    unique("user_org_email_unique").on(table.org_id, table.email),
    index("user_org_idx").on(table.org_id),
    index("user_email_idx").on(table.email),
  ]
);
