import express from "express";
import { rateLimit } from "express-rate-limit";

import { login, logout, getMe } from "../controllers/auth.controller.js";

import { protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

router.post("/login", loginLimiter, login);

router.post("/logout", protectAdmin, logout);

router.get("/me", protectAdmin, getMe);

export default router;
