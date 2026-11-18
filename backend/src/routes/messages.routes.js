import express from "express";

// import {
//   getMessages,
//   getMessageById,
//   updateMessageReadStatus,
//   updateMessageStatus,
//   archiveMessage,
//   restoreArchivedMessage,
//   moveMessageToTrash,
//   restoreTrashedMessage,
//   permanentlyDeleteMessage,
// } from "../controllers/messages.controller.js";

import {
  bulkUpdateMessages,
  getMessages,
  getMessageById,
  updateMessageReadStatus,
  updateMessageStatus,
  archiveMessage,
  restoreArchivedMessage,
  moveMessageToTrash,
  restoreTrashedMessage,
  permanentlyDeleteMessage,
} from "../controllers/messages.controller.js";

import { protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all message management routes
router.use(protectAdmin);

// List and details
router.get("/", getMessages);
router.patch("/bulk", bulkUpdateMessages);
router.get("/:id", getMessageById);

// Message status
router.patch("/:id/read", updateMessageReadStatus);
router.patch("/:id/status", updateMessageStatus);

// Archive
router.patch("/:id/archive", archiveMessage);
router.patch("/:id/restore-archive", restoreArchivedMessage);

// Trash
router.delete("/:id", moveMessageToTrash);
router.patch("/:id/restore-trash", restoreTrashedMessage);
router.delete("/:id/permanent", permanentlyDeleteMessage);

export default router;
