import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db/index";
import { admin, apiKey, organization } from "better-auth/plugins"


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    advanced:{
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
                required: true,
            }
        }
    },
    plugins: [
        admin(),
        apiKey(),
        organization(),
    ]
});