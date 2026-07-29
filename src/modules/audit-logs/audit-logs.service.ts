import type { AuditLogQuery } from "./audit-logs.dto.js";
import * as auditLogsRepository from "./audit-logs.repository.js";

function requireAdmin(userRole: string | undefined) {
  if (userRole !== "admin") throw new ServiceError("Only administrators can view audit logs", 403);
}

export async function listAuditLogs(query: AuditLogQuery, userRole?: string) {
  requireAdmin(userRole);
  return auditLogsRepository.findAuditLogs(query);
}

export async function getAuditLog(id: string, userRole?: string) {
  requireAdmin(userRole);
  const log = await auditLogsRepository.findAuditLogById(id);
  if (!log) throw new ServiceError("Audit log entry not found", 404);
  return log;
}

export async function listActions(userRole?: string) {
  requireAdmin(userRole);
  return auditLogsRepository.findDistinctActions();
}

export async function listEntityTypes(userRole?: string) {
  requireAdmin(userRole);
  return auditLogsRepository.findDistinctEntityTypes();
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
