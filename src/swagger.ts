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
  },
  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
