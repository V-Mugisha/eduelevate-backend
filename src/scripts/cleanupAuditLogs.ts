import "dotenv/config";
import { cleanupAuditLogs } from "../lib/auditLog.js";

const DEFAULT_RETENTION_DAYS = 90;

const retentionDays = Number(process.env["AUDIT_LOG_RETENTION_DAYS"]) || DEFAULT_RETENTION_DAYS;

console.log(`Cleaning up audit logs older than ${retentionDays} days...`);

const deletedCount = await cleanupAuditLogs(retentionDays);

console.log(`Deleted ${deletedCount} audit log entries.`);
