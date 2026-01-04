import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  int,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { uuidv7 } from "uuidv7"


export const user = sqliteTable("user", {
  id: text().primaryKey().$default(() => uuidv7()),
  name: text().notNull(),
  email: text().notNull().unique(),
  email_verified: int({ mode: "boolean" }).default(false).notNull(),
  image: text(),
  created_at: int().$default(() => Date.now()).notNull(),
  updated_at: int().$default(() => Date.now()).$onUpdate(() => Date.now()).notNull(),
  role: text(),
  banned: int({ mode: "boolean" }).default(false),
  banReason: text(),
  banExpires: int(),
  org_id: text().notNull(),
});

export const session = sqliteTable("session", {
    id: text().primaryKey().$default(() => uuidv7()),
    expires_at: int().notNull(),
    token: text().notNull().unique(),
    created_at: int().$default(() => Date.now()).notNull(),
    updated_at: int().$onUpdate(() => Date.now()).notNull(),
    ip_address: text(),
    user_agent: text(),
    user_id: text().notNull().references(() => user.id, { onDelete: "cascade" }),
    impersonated_by: text(),
    active_organization_id: text(),
  },
  (table) => [index("session_userId_idx").on(table.user_id)],
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
    updated_at: int().$onUpdate(() => Date.now()).notNull(),
  },
  (table) => [index("account_userId_idx").on(table.user_id)],
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

export const apikey = sqliteTable("apikey", {
    id: text().primaryKey().$default(() => uuidv7()),
    name: text(),
    start: text(),
    prefix: text(),
    key: text().notNull(),
    user_id: text().notNull().references(() => user.id, { onDelete: "cascade" }),
    refill_interval: int(),
    refill_amount: int(),
    last_refill_at: int(),
    enabled: int({ mode: "boolean" }).default(true),
    rate_limit_enabled: int({ mode: "boolean",}).default(true),
    rate_limit_time_window: int().default(86400000),
    rate_limit_max: int().default(10),
    request_count: int().default(0),
    remaining: int(),
    last_request: int(),
    expires_at: int(),
    created_at: int().notNull(),
    updated_at: int().notNull(),
    permissions: text(),
    metadata: text(),
  },
  (table) => [
    index("apikey_key_idx").on(table.key),
    index("apikey_user_id_idx").on(table.user_id),
  ],
);

export const organization = sqliteTable("organization", {
    id: text().primaryKey().$default(() => uuidv7()),
    name: text().notNull(),
    slug: text().notNull().unique(),
    logo_url: text(),
    plan: text().default("basic").notNull(),
    created_at: int().notNull(),
    metadata: text(),
  },
  (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const member = sqliteTable("member", {
    id: text().primaryKey().$default(() => uuidv7()),
    organization_id: text().notNull().references(() => organization.id, { onDelete: "cascade" }),
    user_id: text().notNull().references(() => user.id, { onDelete: "cascade" }),
    role: text().default("member").notNull(),
    created_at: int().notNull(),
  },
  (table) => [
    index("member_organization_id_idx").on(table.organization_id),
    index("member_user_id_idx").on(table.user_id),
  ],
);

export const invitation = sqliteTable("invitation", {
    id: text().primaryKey().$default(() => uuidv7()),
    organization_id: text().notNull().references(() => organization.id, { onDelete: "cascade" }),
    email: text().notNull(),
    role: text(),
    status: text().default("pending").notNull(),
    expires_at: int().notNull(),
    created_at: int().$default(() => Date.now()).notNull(),
    inviter_id: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_organization_id_idx").on(table.organization_id),
    index("invitation_email_idx").on(table.email),
  ],
);

export const user_relations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  apikeys: many(apikey),
  members: many(member),
  invitations: many(invitation),
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

export const apikey_relations = relations(apikey, ({ one }) => ({
  user: one(user, {
    fields: [apikey.user_id],
    references: [user.id],
  }),
}));

export const organization_relations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}));

export const member_relations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organization_id],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.user_id],
    references: [user.id],
  }),
}));

export const invitation_relations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organization_id],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviter_id],
    references: [user.id],
  }),
}));
