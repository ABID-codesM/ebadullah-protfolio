import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import pool from "./src/config/db.js";

import {
  startEmailRetryWorker,
  stopEmailRetryWorker,
} from "./src/services/emailRetry.worker.js";
import { startReplyRetryWorker } from "./src/services/replyRetry.worker.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test Database Connection
    await pool.query("SELECT 1");

    console.log("PostgreSQL connected successfully.");

    // Start Email Retry Worker
    startEmailRetryWorker();
    startReplyRetryWorker();

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    let isShuttingDown = false;

    const shutdown = (signal) => {
      if (isShuttingDown) return;

      isShuttingDown = true;

      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        try {
          await stopEmailRetryWorker();

          await pool.end();

          console.log("Server, Email Worker, and database connections closed.");

          process.exit(0);
        } catch (error) {
          console.error("Shutdown error:", error);

          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error.message);

    await pool.end();

    process.exit(1);
  }
};

startServer();
