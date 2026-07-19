import type { Request, Response, NextFunction } from "express";
import * as categoriesService from "./categories.service.js";

export async function listCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoriesService.listCategories();
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
}
