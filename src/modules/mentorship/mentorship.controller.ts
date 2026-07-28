import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  createProfileSchema,
  updateProfileSchema,
  createApplicationSchema,
  rejectApplicationSchema,
  endMentorshipSchema,
} from "./mentorship.dto.js";
import * as mentorshipService from "./mentorship.service.js";

function handleError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.issues.map((i) => i.message).join(", ") });
    return;
  }
  next(error);
}

export async function createProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = createProfileSchema.parse(req.body);
    const profile = await mentorshipService.createProfile(userId, data);
    res.status(201).json({ data: profile });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = updateProfileSchema.parse(req.body);
    const profile = await mentorshipService.updateProfile(userId, data);
    res.json({ data: profile });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function removeProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    await mentorshipService.removeProfile(userId);
    res.json({ message: "Profile removed" });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await mentorshipService.getProfile(req.params.userId as string);
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
}

export async function searchEducators(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query.q as string | undefined;
    const educators = await mentorshipService.searchEducators(query);
    res.json({ data: educators });
  } catch (error) {
    next(error);
  }
}

export async function getEducator(req: Request, res: Response, next: NextFunction) {
  try {
    const educator = await mentorshipService.getEducator(req.params.userId as string);
    res.json({ data: educator });
  } catch (error) {
    next(error);
  }
}

export async function apply(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = createApplicationSchema.parse(req.body);
    const app = await mentorshipService.applyForMentorship(
      userId,
      req.params.educatorId as string,
      data,
    );
    res.status(201).json({ data: app });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function listMyApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const apps = await mentorshipService.listMyApplications(userId);
    res.json({ data: apps });
  } catch (error) {
    next(error);
  }
}

export async function listReceivedApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const apps = await mentorshipService.listReceivedApplications(userId);
    res.json({ data: apps });
  } catch (error) {
    next(error);
  }
}

export async function acceptApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const mentorship = await mentorshipService.acceptApplication(req.params.id as string, userId);
    res.json({ data: mentorship });
  } catch (error) {
    next(error);
  }
}

export async function rejectApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = rejectApplicationSchema.parse(req.body);
    const app = await mentorshipService.rejectApplication(req.params.id as string, userId, data);
    res.json({ data: app });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function listMentorships(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const mentorships = await mentorshipService.listMentorships(userId);
    res.json({ data: mentorships });
  } catch (error) {
    next(error);
  }
}

export async function getMentorship(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const mentorship = await mentorshipService.getMentorship(req.params.id as string, userId);
    res.json({ data: mentorship });
  } catch (error) {
    next(error);
  }
}

export async function endMentorship(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = endMentorshipSchema.parse(req.body);
    const mentorship = await mentorshipService.endMentorship(req.params.id as string, userId, data);
    res.json({ data: mentorship });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const { content } = req.body as { content: string };
    if (!content || !content.trim()) {
      res.status(400).json({ message: "Message content is required" });
      return;
    }
    const msg = await mentorshipService.sendMessage(
      req.params.id as string,
      userId,
      content.trim(),
    );
    res.status(201).json({ data: msg });
  } catch (error) {
    next(error);
  }
}

export async function listMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const messages = await mentorshipService.listMessages(req.params.id as string, userId);
    res.json({ data: messages });
  } catch (error) {
    next(error);
  }
}

export async function rateEducator(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const { rating } = req.body as { rating: number };
    if (!rating || rating < 1 || rating > 10 || !Number.isInteger(rating)) {
      res.status(400).json({ message: "Rating must be an integer between 1 and 10" });
      return;
    }
    const result = await mentorshipService.rateEducator(req.params.id as string, userId, rating);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getEducatorRating(req: Request, res: Response, next: NextFunction) {
  try {
    const rating = await mentorshipService.getEducatorRating(req.params.userId as string);
    res.json({ data: rating });
  } catch (error) {
    next(error);
  }
}
