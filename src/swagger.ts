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
      schemas: {
        AuthUser: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "a54200b8-95b6-484e-97f4-3da39927a366",
            },
            email: {
              type: "string",
              format: "email",
              example: "jean@example.com",
            },
            firstName: {
              type: "string",
              example: "Jean",
            },
            lastName: {
              type: "string",
              example: "de Dieu",
            },
            role: {
              type: "string",
              enum: ["student", "educator", "admin"],
              example: "student",
            },
          },
        },
      },
    },
  },
  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
