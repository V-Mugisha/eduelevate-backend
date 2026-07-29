import { prisma } from "@/lib/prisma";

export async function getStudentStats(userId: string) {
  const [enrollments, certificates, mentorships, recentEnrollments] = await Promise.all([
    prisma.enrollment.count({ where: { userId } }),
    prisma.certificate.count({ where: { userId } }),
    prisma.mentorship.count({
      where: { studentId: userId, endedAt: null },
    }),
    prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        createdAt: true,
        course: {
          select: {
            id: true,
            title: true,
            subtitle: true,
          },
        },
        completedLessons: { select: { lessonId: true } },
      },
    }),
  ]);

  const recentWithProgress = await Promise.all(
    recentEnrollments.map(async (e) => {
      const lessons = await prisma.lesson.count({
        where: { module: { courseId: e.course.id } },
      });
      const completed = e.completedLessons.length;
      const progress = lessons > 0 ? Math.round((completed / lessons) * 100) : 0;
      return {
        courseId: e.course.id,
        courseTitle: e.course.title,
        courseSubtitle: e.course.subtitle,
        enrolledAt: e.createdAt.toISOString(),
        progress,
        completedLessons: completed,
        totalLessons: lessons,
      };
    }),
  );

  return {
    enrolledCourses: enrollments,
    certificatesEarned: certificates,
    activeMentorships: mentorships,
    recentEnrollments: recentWithProgress,
  };
}

export async function getEducatorStats(userId: string) {
  const [publishedCourses, draftCourses, totalStudents, pendingApplications, recentCourses] =
    await Promise.all([
      prisma.course.count({ where: { createdBy: userId, isPublished: true } }),
      prisma.course.count({ where: { createdBy: userId, isPublished: false } }),
      prisma.enrollment.count({
        where: { course: { createdBy: userId } },
      }),
      prisma.mentorshipApplication.count({
        where: { educatorId: userId, status: "pending" },
      }),
      prisma.course.findMany({
        where: { createdBy: userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          isPublished: true,
          createdAt: true,
          category: { select: { name: true } },
          _count: { select: { enrollments: true } },
        },
      }),
    ]);

  return {
    publishedCourses,
    draftCourses,
    totalStudents,
    pendingMentorshipApplications: pendingApplications,
    recentCourses: recentCourses.map((c) => ({
      id: c.id,
      title: c.title,
      isPublished: c.isPublished,
      category: c.category.name,
      enrolledCount: c._count.enrollments,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}

export async function getAdminStats() {
  const [totalUsers, totalCourses, totalEnrollments, totalCertificates, recentAuditLogs] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.certificate.count(),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          action: true,
          entityType: true,
          status: true,
          createdAt: true,
          performer: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
    ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalCertificates,
    recentAuditLogs,
  };
}
