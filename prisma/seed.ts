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

  // Create 8 dummy events
  const events = [
    {
      image: "https://i.imgur.com/rNd6zT7.jpeg",
      name: "Annual Gala",
      description: "A night of celebration and networking.",
      category: "Cultural",
      status: "upcoming",
      eventStart: new Date("2024-10-15T18:00:00Z"),
      eventEnd: new Date("2024-10-15T23:00:00Z"),
    },
    {
      image: "https://i.imgur.com/I8UL6tv.jpeg",
      name: "Tech Workshop 2024",
      description: "Learn the latest in web development technologies.",
      category: "Workshop",
      status: "upcoming",
      eventStart: new Date("2024-09-05T09:00:00Z"),
      eventEnd: new Date("2024-09-05T17:00:00Z"),
    },
    {
      image: "https://i.imgur.com/9JUHL5z.jpeg",
      name: "Summer Music Festival",
      description: "Three days of non-stop music from top artists.",
      category: "Festival",
      status: "upcoming",
      eventStart: new Date("2024-07-01T12:00:00Z"),
      eventEnd: new Date("2024-07-03T23:00:00Z"),
    },
    {
      image: "https://i.imgur.com/6O4ZLSg.jpeg",
      name: "Leadership Training",
      description: "Intensive course on effective leadership strategies.",
      category: "Training session",
      status: "ongoing",
      eventStart: new Date("2024-06-10T09:00:00Z"),
      eventEnd: new Date("2024-06-14T17:00:00Z"),
    },
    {
      image: "https://i.imgur.com/NFuFbtk.png",
      name: "City Marathon",
      description: "Annual marathon through the heart of the city.",
      category: "Tournament",
      status: "upcoming",
      eventStart: new Date("2024-11-20T07:00:00Z"),
      eventEnd: new Date("2024-11-20T15:00:00Z"),
    },
    {
      image: "https://i.imgur.com/NbvoqmD.jpeg",
      name: "Classical Orchestra Night",
      description: "An evening of classical masterpieces.",
      category: "Concert",
      status: "upcoming",
      eventStart: new Date("2024-08-25T19:30:00Z"),
      eventEnd: new Date("2024-08-25T22:00:00Z"),
    },
    {
      image: "https://i.imgur.com/oAXXOVN.jpeg",
      name: "Charity Gala Dinner",
      description: "Raising funds for local children's hospitals.",
      category: "Fundraiser",
      status: "upcoming",
      eventStart: new Date("2024-12-05T18:00:00Z"),
      eventEnd: new Date("2024-12-05T23:00:00Z"),
    },
    {
      image: "https://i.imgur.com/B2aAm9u.jpeg",
      name: "Winter Market",
      location: "Various locations across the city",
      description: "Annual market featuring local artisans and food vendors.",
      category: "Market",
      status: "upcoming",
      eventStart: new Date("2024-12-15T10:00:00Z"),
      eventEnd: new Date("2024-12-24T20:00:00Z"),
    },
    {
      image: "https://i.imgur.com/d0KIMTI.jpeg",
      name: "Summer Reading Program",
      description:
        "Encouraging literacy through a city-wide reading challenge.",
      category: "Workshop",
      status: "ongoing",
      eventStart: new Date("2024-06-01T00:00:00Z"),
      eventEnd: new Date("2024-08-31T23:59:59Z"),
    },
    {
      image: "https://i.imgur.com/2ryqa6p.jpeg",
      name: "Fitness Boot Camp",
      description: "Get in shape with our intensive fitness program.",
      category: "Training session",
      status: "ongoing",
      eventStart: new Date("2024-05-15T06:00:00Z"),
      eventEnd: new Date("2024-07-15T08:00:00Z"),
    },
    {
      image: "https://i.imgur.com/v123SUI.jpeg",
      name: "Local Theater Production",
      description: "Weekly performances of 'A Midsummer Night's Dream'.",
      category: "Cultural",
      status: "ongoing",
      eventStart: new Date("2024-06-01T19:00:00Z"),
      eventEnd: new Date("2024-08-31T22:00:00Z"),
    },
    {
      image: "https://i.imgur.com/mdetw7O.jpeg",
      name: "Farmer's Market",
      description: "Weekly market featuring fresh local produce.",
      category: "Market",
      status: "ongoing",
      eventStart: new Date("2024-05-01T08:00:00Z"),
      eventEnd: new Date("2024-10-31T14:00:00Z"),
    },
  ];

  for (const eventData of events) {
    const category = await prisma.category.findFirst({
      where: { name: eventData.category },
    });

    if (category) {
      await prisma.event.create({
        data: {
          image: eventData.image,
          name: eventData.name,
          location: "Central Park",
          description: eventData.description,
          status: eventData.status,
          eventStart: eventData.eventStart,
          eventEnd: eventData.eventEnd,
          vendorId: vendor.id,
          categoryId: category.id,
          featured: Math.random() < 0.3, // 30% chance of being featured
        },
      });
    }
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
