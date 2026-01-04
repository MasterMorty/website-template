import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { organizations } from "./organizations";
import { users } from "./users";
import { uuidv7 } from "uuidv7"

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    org_id: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    status: text("status").default("active").notNull(), // active, archived, deleted
    public_api_key: text("public_api_key").unique(),
    domain: text("domain").unique(),
    git_repo: text("git_repo"),
    created_by_id: text("created_by_id").notNull().references(() => users.id, { onDelete: "set null" }),
    created_at: int("created_at").notNull().$default(() => Date.now()),
    updated_at: int("updated_at").notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
  },
  (table) => [
    unique("project_org_slug_unique").on(table.org_id, table.slug),
    index("project_org_idx").on(table.org_id),
    index("project_status_idx").on(table.status),
  ]
);
