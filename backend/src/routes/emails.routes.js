import express from "express";

import {
  getEmailStats,
  getEmails,
  retryContactEmail,
  retryReplyEmail,
} from "../controllers/emails.controller.js";

import { protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectAdmin);

router.get("/stats", getEmailStats);

router.get("/", getEmails);

router.post("/contact/:id/retry", retryContactEmail);

router.post("/replies/:id/retry", retryReplyEmail);

export default router;
