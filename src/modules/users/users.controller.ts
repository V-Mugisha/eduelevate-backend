import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { createUserSchema, updateUserSchema, userQuerySchema } from "./users.dto.js";
import * as usersService from "./users.service.js";

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => issue.message).join(", ");
    res.status(400).json({ message: messages });
    return;
  }
  next(error);
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const query = userQuerySchema.parse(req.query);
    const result = await usersService.listUsers(query, userRole);
    res.json({ data: result.users, total: result.total, page: query.page, limit: query.limit });
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const user = await usersService.getUser(req.params.id as string, userRole);
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = req.user?.userId;
    const userRole = req.user?.role;
    if (!adminId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const data = createUserSchema.parse(req.body);
    const user = await usersService.createUser(data, adminId, userRole);
    res.status(201).json({ message: "User created successfully", data: user });
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = req.user?.userId;
    const userRole = req.user?.role;
    if (!adminId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const data = updateUserSchema.parse(req.body);
    const user = await usersService.updateUser(req.params.id as string, data, adminId, userRole);
    res.json({ message: "User updated successfully", data: user });
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = req.user?.userId;
    const userRole = req.user?.role;
    if (!adminId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const result = await usersService.deleteUser(req.params.id as string, adminId, userRole);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function toggleStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = req.user?.userId;
    const userRole = req.user?.role;
    if (!adminId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const user = await usersService.toggleStatus(req.params.id as string, adminId, userRole);
    res.json({
      message: `User ${user.isActive ? "enabled" : "disabled"} successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
