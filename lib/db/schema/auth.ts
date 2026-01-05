import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  int,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { uuidv7 } from "uuidv7";

export const user = sqliteTable("user", {
  id: text().primaryKey().$default(() => uuidv7()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: int("email_verified", { mode: "boolean" }).default(false).notNull(),
  image: text("image"),
  createdAt: int("created_at").$default(() => Date.now()).notNull(),
  updatedAt: int("updated_at").$default(() => Date.now()).$onUpdate(() => /* @__PURE__ */ Date.now()).notNull(),
  role: text("role"),
  banned: int("banned", { mode: "boolean" }).default(false),
  banReason: text("ban_reason"),
  banExpires: int("ban_expires"),
  org_id: text("org_id").$default(() => uuidv7()).notNull(),
});

export const session = sqliteTable(
"session",
  {
    id: text().primaryKey().$default(() => uuidv7()),
    expiresAt: int("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: int("created_at").$default(() => Date.now()).notNull(),
    updatedAt: int("updated_at").$default(() => Date.now()).$onUpdate(() => /* @__PURE__ */ Date.now()).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
    activeOrganizationId: text("active_organization_id"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text().primaryKey().$default(() => uuidv7()),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: int("access_token_expires_at"),
    refreshTokenExpiresAt: int("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: int("created_at").$default(() => Date.now()).notNull(),
    updatedAt: int("updated_at").$default(() => Date.now()).$onUpdate(() => /* @__PURE__ */ Date.now()).notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text().primaryKey().$default(() => uuidv7()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: int("expires_at").notNull(),
    createdAt: int("created_at").$default(() => Date.now()).notNull(),
    updatedAt: int("updated_at").$default(() => Date.now()).$onUpdate(() => /* @__PURE__ */ Date.now()).notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const apikey = sqliteTable(
  "apikey",
  {
    id: text().primaryKey().$default(() => uuidv7()),
    name: text("name"),
    start: text("start"),
    prefix: text("prefix"),
    key: text("key").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    refillInterval: int("refill_interval"),
    refillAmount: int("refill_amount"),
    lastRefillAt: int("last_refill_at"),
    enabled: int("enabled", { mode: "boolean" }).default(true),
    rateLimitEnabled: int("rate_limit_enabled", {
      mode: "boolean",
    }).default(true),
    rateLimitTimeWindow: int("rate_limit_time_window").default(86400000),
    rateLimitMax: int("rate_limit_max").default(10),
    requestCount: int("request_count").default(0),
    remaining: int("remaining"),
    lastRequest: int("last_request"),
    expiresAt: int("expires_at"),
    createdAt: int("created_at").notNull(),
    updatedAt: int("updated_at").notNull(),
    permissions: text("permissions"),
    metadata: text("metadata"),
  },
  (table) => [
    index("apikey_key_idx").on(table.key),
    index("apikey_userId_idx").on(table.userId),
  ],
);

export const organization = sqliteTable(
  "organization",
  {
    id: text().primaryKey().$default(() => uuidv7()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    createdAt: int("created_at").notNull(),
    metadata: text("metadata"),
  },
  (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const member = sqliteTable(
  "member",
  {
    id: text().primaryKey().$default(() => uuidv7()),
    organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    createdAt: int("created_at").notNull(),
  },
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ],
);

export const invitation = sqliteTable(
  "invitation",
  {
    id: text().primaryKey().$default(() => uuidv7()),
    organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").default("pending").notNull(),
    expiresAt: int("expires_at").notNull(),
    createdAt: int("created_at").$default(() => Date.now()).notNull(),
    inviterId: text("inviter_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  apikeys: many(apikey),
  members: many(member),
  invitations: many(invitation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const apikeyRelations = relations(apikey, ({ one }) => ({
  user: one(user, {
    fields: [apikey.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));
