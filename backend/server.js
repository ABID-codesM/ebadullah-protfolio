import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import pool from "./src/config/db.js";

import {
  startEmailRetryWorker,
  stopEmailRetryWorker,
} from "./src/services/emailRetry.worker.js";

import {
  startReplyRetryWorker,
  stopReplyRetryWorker,
} from "./src/services/replyRetry.worker.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  let server;
  let isShuttingDown = false;

  try {
    // Test Database Connection
    await pool.query("SELECT 1");

    console.log("PostgreSQL connected successfully.");

    // Start Background Workers
    startEmailRetryWorker();
    startReplyRetryWorker();

    // Start Express Server
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Graceful Shutdown
    const shutdown = (signal) => {
      if (isShuttingDown) return;

      isShuttingDown = true;

      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        try {
          // Stop Background Workers
          await stopEmailRetryWorker();
          await stopReplyRetryWorker();

          // Close Database Connections
          await pool.end();

          console.log(
            "Server, Background Workers, and Database Connections closed.",
          );

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

    try {
      await stopEmailRetryWorker();
      await stopReplyRetryWorker();
      await pool.end();
    } catch (shutdownError) {
      console.error("Startup cleanup error:", shutdownError.message);
    }

    process.exit(1);
  }
};

startServer();
