import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import dashboardRoutes from "./src/routes/dashboard.routes.js";
import messagesRoutes from "./src/routes/messages.routes.js";
import repliesRoutes from "./src/routes/replies.routes.js";
import emailsRoutes from "./src/routes/emails.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import visitorsRoutes from "./src/routes/visitors.routes.js";

import { notFound, errorHandler } from "./src/middleware/error.middleware.js";

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS."));
    },
    credentials: true,
  }),
);

// Body Parsing
app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: false,
    limit: "10kb",
  }),
);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running.",
  });
});

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/replies", repliesRoutes);
app.use("/api/emails", emailsRoutes);
app.use("/api/visitors", visitorsRoutes);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;
