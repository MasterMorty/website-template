import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
    project: ["create", "read", "update", "delete", "share"],
    content: ["create", "read", "update", "delete", "publish"],
    media: ["upload", "delete", "manage"],
} as const;

export const ac = createAccessControl(statement);

export const superadmin = ac.newRole({
    ...adminAc.statements,
    project: ["create", "read", "update", "delete", "share"],
    content: ["create", "read", "update", "delete", "publish"],
    media: ["upload", "delete", "manage"],
});

export const admin = ac.newRole({
    ...adminAc.statements,
    project: ["create", "read", "update", "delete"],
    content: ["create", "read", "update", "delete", "publish"],
    media: ["upload", "delete", "manage"],
});

export const user = ac.newRole({
    project: ["read", "update"],
    content: ["create", "read", "update"],
    media: ["upload", "delete"],
});

export const viewer = ac.newRole({
    project: ["read"],
    content: ["read"],
});
