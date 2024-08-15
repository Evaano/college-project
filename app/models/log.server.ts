import { prisma } from "~/db.server";

export async function getAuditLogData(page: number, itemsPerPage: number) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
  });
}

export async function getTotalLogs() {
  return prisma.auditLog.count();
}
