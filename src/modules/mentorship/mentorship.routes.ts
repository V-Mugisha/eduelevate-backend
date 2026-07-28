import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as mentorshipController from "./mentorship.controller.js";

const router = Router({ mergeParams: true });

router.post("/mentorship/profile", authenticate, mentorshipController.createProfile);
router.put("/mentorship/profile", authenticate, mentorshipController.updateProfile);
router.delete("/mentorship/profile", authenticate, mentorshipController.removeProfile);
router.get("/mentorship/profile/:userId", mentorshipController.getProfile);

router.get("/mentorship/educators", mentorshipController.searchEducators);
router.get("/mentorship/educators/:userId/ratings", mentorshipController.getEducatorRating);
router.get("/mentorship/educators/:userId", mentorshipController.getEducator);

router.post("/mentorship/apply/:educatorId", authenticate, mentorshipController.apply);
router.get("/mentorship/applications", authenticate, mentorshipController.listMyApplications);
router.get(
  "/mentorship/applications/received",
  authenticate,
  mentorshipController.listReceivedApplications,
);
router.post(
  "/mentorship/applications/:id/accept",
  authenticate,
  mentorshipController.acceptApplication,
);
router.post(
  "/mentorship/applications/:id/reject",
  authenticate,
  mentorshipController.rejectApplication,
);

router.get("/mentorship", authenticate, mentorshipController.listMentorships);
router.get("/mentorship/:id/messages", authenticate, mentorshipController.listMessages);
router.post("/mentorship/:id/messages", authenticate, mentorshipController.sendMessage);
router.post("/mentorship/:id/rate", authenticate, mentorshipController.rateEducator);
router.get("/mentorship/:id", authenticate, mentorshipController.getMentorship);
router.post("/mentorship/:id/end", authenticate, mentorshipController.endMentorship);

export default router;
