// import { Router } from "express";

// import { track, trackEvent } from "../controllers/visitors.controller.js";

// const router = Router();

// // Public tracking endpoints
// router.post("/track", track);
// router.post("/events", trackEvent);

// export default router;
/////
import { Router } from "express";

import {
  track,
  trackEvent,
  getAdminVisitorsOverview,
  getAdminVisitorsList,
  getAdminVisitorDetails,
} from "../controllers/visitors.controller.js";

import { protectAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// ============================================
// PUBLIC TRACKING ROUTES
// ============================================

router.post("/track", track);
router.post("/events", trackEvent);

// ============================================
// PROTECTED ADMIN VISITORS ROUTES
// ============================================

router.get("/admin/overview", protectAdmin, getAdminVisitorsOverview);

router.get("/admin", protectAdmin, getAdminVisitorsList);

router.get("/admin/:id", protectAdmin, getAdminVisitorDetails);

export default router;
