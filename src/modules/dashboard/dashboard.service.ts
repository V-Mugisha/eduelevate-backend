import * as dashboardRepository from "./dashboard.repository.js";

export async function getDashboardStats(userId: string, userRole: string) {
  if (userRole === "student") {
    return dashboardRepository.getStudentStats(userId);
  }

  if (userRole === "educator") {
    return dashboardRepository.getEducatorStats(userId);
  }

  if (userRole === "admin") {
    return dashboardRepository.getAdminStats();
  }

  throw new ServiceError("Unknown user role", 400);
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
