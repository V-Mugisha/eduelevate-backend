import type { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "./upload.service.js";

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file provided" });
      return;
    }

    const url = await uploadToCloudinary(req.file.buffer);
    res.json({ url });
  } catch (error) {
    next(error);
  }
}
