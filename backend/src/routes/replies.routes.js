import express from "express";

import {
  getMessageReplies,
  createMessageReply,
} from "../controllers/replies.controler.js";

import { protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectAdmin);

router.get("/:id", getMessageReplies);

router.post("/:id", createMessageReply);

export default router;
