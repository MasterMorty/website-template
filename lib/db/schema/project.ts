import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { organization } from "./organization";
import { user } from "./auth";
import { uuidv7 } from "uuidv7"

export const project = sqliteTable("project", {
    id: text().primaryKey().$default(() => uuidv7()),
    org_id: text().notNull().references(() => organization.id, { onDelete: "cascade" }),
    name: text().notNull(),
    slug: text().notNull(),
    description: text(),
    status: text().default("active").notNull(), // active, archived, deleted
    public_api_key: text().unique(),
    domain: text().unique(),
    git_repo: text(),
    created_by_id: text().notNull().references(() => user.id, { onDelete: "set null" }),
    created_at: int().notNull().$default(() => Date.now()),
    updated_at: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
  },
  (table) => [
    unique("project_org_slug_unique").on(table.org_id, table.slug),
    index("project_org_idx").on(table.org_id),
    index("project_status_idx").on(table.status),
  ]
);
