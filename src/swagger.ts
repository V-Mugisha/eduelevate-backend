import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EduElevate API",
      version: "1.0.0",
      description:
        "Backend API for the EduElevate learning platform. Provides authentication, course management, interactive exercises, and mentorship endpoints.",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AuthUser: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            role: { type: "string", enum: ["student", "educator", "admin"] },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        Course: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            subtitle: { type: "string", nullable: true },
            description: { type: "string" },
            level: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
            duration: { type: "string", nullable: true },
            isPublished: { type: "boolean" },
            maxStudents: { type: "integer", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Module: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            courseId: { type: "string", format: "uuid" },
            title: { type: "string" },
            subtitle: { type: "string", nullable: true },
            description: { type: "string", nullable: true },
            prerequisites: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Lesson: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            moduleId: { type: "string", format: "uuid" },
            title: { type: "string" },
            subtitle: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Assessment: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            lessonId: { type: "string", format: "uuid" },
            title: { type: "string", nullable: true },
            instructions: { type: "string", nullable: true },
            isGraded: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Question: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            assessmentId: { type: "string", format: "uuid" },
            title: { type: "string" },
            answerOptions: { type: "array", items: { type: "string" } },
            correctAnswers: { type: "array", items: { type: "string" } },
            grade: { type: "integer" },
            order: { type: "integer" },
          },
        },
        Certificate: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            courseId: { type: "string", format: "uuid" },
            issuedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
