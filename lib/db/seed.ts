import { drizzle } from 'drizzle-orm/libsql';
import { organization, user, account } from "./schema/auth";
import { project } from "./schema/project";
import { uuidv7 } from "uuidv7";
import { eq } from 'drizzle-orm';
import * as schema from './schema';

// Create a local database connection for seeding
const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  },
  casing: 'snake_case',
  schema,
});

async function seed() {
  console.log("🌱 Starting seed...");

  try {
    const email = "test@novafox.at";
    const orgSlug = "novafox";
    
    // Check if user already exists
    const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
    if (existingUser.length > 0) {
      console.log("⚠️  User already exists. Skipping seed.");
      console.log("\nLogin credentials:");
      console.log("Email: test@novafox.at");
      console.log("Password: 123456789");
      process.exit(0);
    }

    // Check if organization already exists
    const existingOrg = await db.select().from(organization).where(eq(organization.slug, orgSlug)).limit(1);
    let orgId: string;
    
    if (existingOrg.length > 0) {
      console.log("ℹ️  Organization already exists. Using existing organization.");
      orgId = existingOrg[0].id;
    } else {
      // 1. Create organization
      orgId = uuidv7();
      await db.insert(organization).values({
        id: orgId,
        name: "novafox",
        slug: "novafox",
        createdAt: Date.now(),
      });
      console.log("✅ Organization created");
    }

    // 2. Create admin user
    const userId = uuidv7();
    await db.insert(user).values({
      id: userId,
      name: "Admin",
      email: email,
      emailVerified: true,
      role: "superadmin",
      org_id: orgId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ User created");

    // 3. Create account with password
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash("123456789", 10);
    
    await db.insert(account).values({
      id: uuidv7(),
      accountId: userId,
      providerId: "credential",
      userId: userId,
      password: hashedPassword,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ Account created with password");

    // 4. Create project (check if it already exists for this org)
    const existingProject = await db.select().from(project)
      .where(eq(project.slug, "novafox"))
      .limit(1);
    
    if (existingProject.length === 0) {
      await db.insert(project).values({
        id: uuidv7(),
        org_id: orgId,
        name: "novafox",
        slug: "novafox",
        status: "active",
        created_by_id: userId,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      console.log("✅ Project created");
    } else {
      console.log("ℹ️  Project already exists. Skipping project creation.");
    }

    console.log("\n🎉 Seed completed successfully!");
    console.log("\nLogin credentials:");
    console.log("Email: flo@novafox.at");
    console.log("Password: 123456789");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
