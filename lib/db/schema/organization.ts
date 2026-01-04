import { sqliteTable, text, int, index } from "drizzle-orm/sqlite-core";
import { uuidv7 } from "uuidv7";

export const organization = sqliteTable("organization", {
    id: text().primaryKey().$default(() => uuidv7()),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text(),
    logo_url: text(),
    plan: text().default("basic").notNull(), // basic, pro, enterprise
    status: text().default("active").notNull(), // active, suspended, deleted
    stripe_customer_id: text(),
    created_at: int().notNull().$default(() => Date.now()),
    updated_at: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
  },
  (table) => [
    index("org_slug_idx").on(table.slug),
    index("org_status_idx").on(table.status),
  ]
);
