import { sqliteTable, text, int, index } from "drizzle-orm/sqlite-core";
import { uuidv7 } from "uuidv7";

export const organizations = sqliteTable(
  "organizations",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    logo_url: text("logo_url"),
    plan: text("plan").default("basic").notNull(), // basic, pro, enterprise
    status: text("status").default("active").notNull(), // active, suspended, deleted
    stripe_customer_id: text("stripe_customer_id"),
    created_at: int("created_at").notNull().$default(() => Date.now()),
    updated_at: int("updated_at").notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
  },
  (table) => [
    index("org_slug_idx").on(table.slug),
    index("org_status_idx").on(table.status),
  ]
);
