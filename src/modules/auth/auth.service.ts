import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type {
  StudentRegisterInput,
  EducatorRegisterInput,
  LoginInput,
  AuthResponse,
} from "./auth.dto.js";
import * as authRepository from "./auth.repository.js";

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env["JWT_SECRET"] ?? "eduelevate_jwt_secret_dev";
const JWT_EXPIRES_IN = "7d";

interface JwtPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

function generateToken(
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
): string {
  const payload: JwtPayload = { userId, email, firstName, lastName, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function registerStudent(data: StudentRegisterInput): Promise<AuthResponse> {
  const existingUser = await authRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new ServiceError("A user with this email already exists", 409);
  }

  const role = await authRepository.findRoleByName("student");
  if (!role) {
    throw new ServiceError("Student role not found in the system", 500);
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await authRepository.createUserWithStudentProfile(
    {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: role.id,
    },
    {
      schoolName: data.schoolName,
      grade: data.grade,
    },
  );

  const token = generateToken(user.id, user.email, user.firstName, user.lastName, user.role.name);

  return {
    message: "Student account created successfully",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
      token,
    },
  };
}

export async function registerEducator(data: EducatorRegisterInput): Promise<AuthResponse> {
  const existingUser = await authRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new ServiceError("A user with this email already exists", 409);
  }

  const role = await authRepository.findRoleByName("educator");
  if (!role) {
    throw new ServiceError("Educator role not found in the system", 500);
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await authRepository.createUserWithEducatorProfile(
    {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: role.id,
    },
    {
      isIndependent: data.isIndependent,
      organizationName: data.organizationName ?? null,
      expertiseAreas: data.expertiseAreas,
      yearsOfExperience: data.yearsOfExperience ?? null,
      bio: data.bio,
    },
  );

  const token = generateToken(user.id, user.email, user.firstName, user.lastName, user.role.name);

  return {
    message: "Educator account created successfully",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
      token,
    },
  };
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  const user = await authRepository.findUserByEmail(data.email);
  if (!user) {
    throw new ServiceError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new ServiceError("This account has been deactivated. Please contact support.", 403);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ServiceError("Invalid email or password", 401);
  }

  const token = generateToken(user.id, user.email, user.firstName, user.lastName, user.role.name);

  return {
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
      token,
    },
  };
}

export class ServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
