import { relations } from "drizzle-orm";
import { sqliteTable, text, int, index, unique } from "drizzle-orm/sqlite-core";
import { uuidv7 } from "uuidv7"
import { organization } from "./organization";

export const user = sqliteTable("user", {
  id: text().primaryKey().$default(() => uuidv7()),
  org_id: text().notNull().references(() => organization.id, { onDelete: "cascade" }),
  name: text().notNull(),
  email: text().notNull().unique(),
  email_verified: int({ mode: "boolean" }).default(false).notNull(),
  status: text().default("active").notNull(), // active, inactive, deleted
  image: text(),
  created_at: int().$default(() => Date.now()).notNull(),
  updated_at: int().$default(() => Date.now()).$onUpdate(() => Date.now()).notNull(),
},
(table) => [
    unique("user_org_email_unique").on(table.org_id, table.email),
    index("user_org_idx").on(table.org_id),
]
);

export const session = sqliteTable("session", {
    id: text().primaryKey().$default(() => uuidv7()),
    expires_at: int().notNull(),
    token: text().notNull().unique(),
    created_at: int().$default(() => Date.now()).notNull(),
    updated_at: int().$default(() => Date.now()).$onUpdate(() => Date.now()).notNull(),
    ip_address: text(),
    user_agent: text(),
    user_id: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.user_id)],
);

export const account = sqliteTable("account", {
    id: text().primaryKey().$default(() => uuidv7()),
    account_id: text().notNull(),
    provider_id: text().notNull(),
    user_id: text().notNull().references(() => user.id, { onDelete: "cascade" }),
    access_token: text(),
    refresh_token: text(),
    id_token: text(),
    access_token_expires_at: int(),
    refresh_token_expires_at: int(),
    scope: text(),
    password: text(),
    created_at: int().$default(() => Date.now()).notNull(),
    updated_at: int().$default(() => Date.now()).$onUpdate(() => Date.now()).notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.user_id)],
);

export const verification = sqliteTable("verification", {
    id: text().primaryKey().$default(() => uuidv7()),
    identifier: text().notNull(),
    value: text().notNull(),
    expires_at: int().notNull(),
    created_at: int().$default(() => Date.now()).notNull(),
    updated_at: int().$default(() => Date.now()).$onUpdate(() => Date.now()).notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const user_relations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const session_relations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.user_id],
    references: [user.id],
  }),
}));

export const account_relations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.user_id],
    references: [user.id],
  }),
}));
