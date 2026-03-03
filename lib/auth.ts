import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db/index";
import { admin, apiKey, organization } from "better-auth/plugins";
import { ac, superadmin, admin as adminRole, user as userRole, viewer } from "./permissions";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.APP_URL ?? "", process.env.BETTER_AUTH_URL ?? ""].filter(Boolean),
    advanced: {
        database: {
            generateId: false,
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            org_id: {
                type: "string",
                required: false,
            }
        }
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/get-session") {
                if (!ctx.context.session) {
                    return ctx.json({
                        session: null,
                        user: null,
                    })
                }
                return ctx.json(ctx.context.session)
            }
        }),
    },
    plugins: [
        admin({
            ac,
            roles: {
                superadmin,
                admin: adminRole,
                user: userRole,
                viewer,
            },
            defaultRole: "user",
        }),
        apiKey({
            enableMetadata: true,
        }),
        organization(),
    ]
});