import { prisma } from "./prisma";

export interface CreateAuditLogParams {
  action: string;
  entityType: string;
  entityId?: string;
  performedBy?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  status?: "success" | "failure";
}

export async function createAuditLog(params: CreateAuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        performedBy: params.performedBy ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        details: (params.details ?? undefined) as any,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
        status: params.status ?? "success",
      },
    });
  } catch {
    // Audit log failures must never break the main operation.
  }
}

export async function cleanupAuditLogs(retentionDays: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  const result = await prisma.auditLog.deleteMany({
    where: { createdAt: { lt: cutoffDate } },
  });

  return result.count;
}
