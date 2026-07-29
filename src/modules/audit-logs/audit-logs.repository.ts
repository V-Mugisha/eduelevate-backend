import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../../prisma/generated/client.js";
import type { AuditLogQuery } from "./audit-logs.dto.js";

export async function findAuditLogs(query: AuditLogQuery) {
  const where: Prisma.AuditLogWhereInput = {};

  if (query.action) {
    where.action = query.action;
  }

  if (query.entityType) {
    where.entityType = query.entityType;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.performedBy) {
    where.performedBy = query.performedBy;
  }

  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) {
      where.createdAt.gte = new Date(query.from);
    }
    if (query.to) {
      where.createdAt.lte = new Date(query.to);
    }
  }

  if (query.q) {
    where.OR = [
      { action: { contains: query.q, mode: "insensitive" } },
      { entityType: { contains: query.q, mode: "insensitive" } },
      {
        performer: {
          firstName: { contains: query.q, mode: "insensitive" },
        },
      },
      {
        performer: {
          lastName: { contains: query.q, mode: "insensitive" },
        },
      },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        status: true,
        details: true,
        createdAt: true,
        performer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}

export async function findAuditLogById(id: string) {
  return prisma.auditLog.findUnique({
    where: { id },
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      status: true,
      details: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      performer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function findDistinctActions() {
  const result = await prisma.auditLog.findMany({
    select: { action: true },
    distinct: ["action"],
    orderBy: { action: "asc" },
  });
  return result.map((r) => r.action);
}

export async function findDistinctEntityTypes() {
  const result = await prisma.auditLog.findMany({
    select: { entityType: true },
    distinct: ["entityType"],
    orderBy: { entityType: "asc" },
  });
  return result.map((r) => r.entityType);
}
