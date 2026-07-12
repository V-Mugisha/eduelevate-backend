import { PrismaClient } from "./generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const permissions = [
  { name: "user:create", description: "Create user accounts" },
  { name: "user:read", description: "View user profiles" },
  { name: "user:update", description: "Update user profiles" },
  { name: "user:delete", description: "Delete user accounts" },
  { name: "course:create", description: "Create courses" },
  { name: "course:read", description: "View courses" },
  { name: "course:update", description: "Update courses" },
  { name: "course:delete", description: "Delete courses" },
  { name: "exercise:create", description: "Create exercises" },
  { name: "exercise:read", description: "View exercises" },
  { name: "exercise:update", description: "Update exercises" },
  { name: "exercise:delete", description: "Delete exercises" },
  { name: "exercise:grade", description: "Grade student exercise submissions" },
  { name: "progress:read", description: "View student progress" },
  { name: "progress:report", description: "Generate progress reports" },
  { name: "system:manage", description: "Full system administration" },
  { name: "role:manage", description: "Assign and revoke roles" },
  { name: "permission:read", description: "View system permissions" },
];

const studentPermissions = ["user:read", "user:update", "course:read", "exercise:read"];

const educatorPermissions = [
  "user:read",
  "user:update",
  "course:create",
  "course:read",
  "course:update",
  "course:delete",
  "exercise:create",
  "exercise:read",
  "exercise:update",
  "exercise:delete",
  "exercise:grade",
  "progress:read",
  "progress:report",
];

const adminPermissions = permissions.map((p) => p.name);

async function main() {
  console.log("Seeding permissions...");
  const createdPermissions: Record<string, string> = {};
  for (const permission of permissions) {
    const created = await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
    createdPermissions[created.name] = created.id;
  }

  console.log("Seeding roles...");
  const studentRole = await prisma.role.upsert({
    where: { name: "student" },
    update: { description: "Advanced level secondary school student" },
    create: { name: "student", description: "Advanced level secondary school student" },
  });

  const educatorRole = await prisma.role.upsert({
    where: { name: "educator" },
    update: { description: "Course creator, tutor, and mentor" },
    create: { name: "educator", description: "Course creator, tutor, and mentor" },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: { description: "Platform administrator with full system access" },
    create: { name: "admin", description: "Platform administrator with full system access" },
  });

  console.log("Assigning permissions to roles...");
  const rolePermissionMap: Record<string, { roleId: string; assignments: string[] }> = {
    student: { roleId: studentRole.id, assignments: studentPermissions },
    educator: { roleId: educatorRole.id, assignments: educatorPermissions },
    admin: { roleId: adminRole.id, assignments: adminPermissions },
  };

  for (const [, config] of Object.entries(rolePermissionMap)) {
    for (const permissionName of config.assignments) {
      const permissionId = createdPermissions[permissionName];
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: config.roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId: config.roleId,
          permissionId,
        },
      });
    }
  }

  console.log("Seeding super admin user...");
  const SALT_ROUNDS = 12;
  const passwordHash = await bcrypt.hash("Admin@123", SALT_ROUNDS);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@eduelevate.com" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "admin@eduelevate.com",
        passwordHash,
        firstName: "Platform",
        lastName: "Administrator",
        roleId: adminRole.id,
      },
    });
    console.log("Super admin user created.");
  } else {
    console.log("Super admin user already exists, skipping.");
  }

  console.log("Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
