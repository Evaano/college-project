import fs from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  // Cleanup existing database
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.password.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Create roles
  const userRole = await prisma.role.create({ data: { name: "user" } });
  const adminRole = await prisma.role.create({ data: { name: "admin" } });

  // Write user role ID to .env file
  const envPath = path.join(__dirname, "..", ".env");

  // Read the existing .env file content
  let envContent = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf8")
    : "";

  // Remove existing DEFAULT_USER_ROLE_ID and ADMIN_ROLE_ID entries
  envContent = envContent
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("DEFAULT_USER_ROLE_ID=") &&
        !line.startsWith("ADMIN_ROLE_ID="),
    )
    .join("\n");

  // Append new role IDs
  envContent += `\nDEFAULT_USER_ROLE_ID="${userRole.id}"\n`;
  envContent += `ADMIN_ROLE_ID="${adminRole.id}"\n`;

  // Write updated content back to .env file
  fs.writeFileSync(envPath, envContent.trim(), "utf8");

  console.log(`User roles have been written to .env file`);

  // Create permissions
  const permissions = [
    "add-event",
    "edit-event",
    "delete-event",
    "view-event",
    "manage-users",
    "manage-vendors",
  ];

  const createdPermissions = await Promise.all(
    permissions.map((name) => prisma.permission.create({ data: { name } })),
  );

  // Assign permissions to roles
  await prisma.rolePermission.createMany({
    data: [
      // User permissions
      {
        roleId: userRole.id,
        permissionId: createdPermissions.find((p) => p.name === "add-event")!
          .id,
      },
      {
        roleId: userRole.id,
        permissionId: createdPermissions.find((p) => p.name === "delete-event")!
          .id,
      },
      {
        roleId: userRole.id,
        permissionId: createdPermissions.find((p) => p.name === "edit-event")!
          .id,
      },
      {
        roleId: userRole.id,
        permissionId: createdPermissions.find((p) => p.name === "view-event")!
          .id,
      },
      // Admin permissions (all)
      ...createdPermissions.map((permission) => ({
        roleId: adminRole.id,
        permissionId: permission.id,
      })),
    ],
  });

  // Create a test user
  const email = "test@remix.run";
  const hashedPassword = await bcrypt.hash("test@123", 10);

  await prisma.user.create({
    data: {
      email,
      roleId: userRole.id,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  // Create a test admin
  const adminEmail = "admin@remix.run";
  const adminHashedPassword = await bcrypt.hash("admin@123", 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      roleId: adminRole.id,
      password: {
        create: {
          hash: adminHashedPassword,
        },
      },
    },
  });

  // Create a dummy vendor
  const vendor = await prisma.vendor.create({
    data: {
      name: "Acme Events Co.",
      description: "We organize the best events in town!",
      address: "123 Main St, Anytown, USA",
      phoneNumber: "555-1234",
    },
  });

  // Create categories
  const categories = [
    { name: "Cultural" },
    { name: "Workshop" },
    { name: "Festival" },
    { name: "Training session" },
    { name: "Tournament" },
    { name: "Concert" },
    { name: "Fundraiser" },
    { name: "Fair" },
    { name: "Market" },
    { name: "Celebration" },
    { name: "Rally" },
  ];

  for (const data of categories) {
    await prisma.category.create({ data });
  }

  const culturalCategory = await prisma.category.findFirst({
    where: { name: "Cultural" },
  });

  if (culturalCategory) {
    await prisma.event.create({
      data: {
        image: "https://example.com/event.jpg",
        name: "Annual Gala",
        location: "Grand Ballroom, 5th Avenue, New York, NY",
        description: "A night of celebration and networking.",
        status: "upcoming",
        eventStart: new Date("2024-10-15T18:00:00Z"),
        eventEnd: new Date("2024-10-15T23:00:00Z"),
        vendorId: vendor.id,
        categoryId: culturalCategory.id,
      },
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
