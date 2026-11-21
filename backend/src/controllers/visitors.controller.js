import {
  trackVisitor,
  recordVisitorEvent,
  getVisitorsOverview,
  getVisitorDetails,
  getVisitorsList,
} from "../services/visitors.service.js";

import {
  validateTrackingPayload,
  validateVisitorEventPayload,
  sanitizeString,
} from "../validators/visitors.validator.js";

export const track = async (req, res, next) => {
  try {
    const validation = validateTrackingPayload(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid tracking data.",
        errors: validation.errors,
      });
    }

    const data = {
      ...req.body,
      pagePath: sanitizeString(req.body.pagePath, 500),
      pageTitle: sanitizeString(req.body.pageTitle || "", 300),
      browser: sanitizeString(req.body.browser || "", 100),
      operatingSystem: sanitizeString(req.body.operatingSystem || "", 100),
      medium: sanitizeString(req.body.medium || "", 100),
      campaign: sanitizeString(req.body.campaign || "", 150),
      referrerDomain: sanitizeString(req.body.referrerDomain || "", 255),
    };

    const result = await trackVisitor(data);

    return res.status(200).json({
      success: true,
      message: "Visitor tracked successfully.",
      data: {
        isNewSession: result.isNewSession,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const trackEvent = async (req, res, next) => {
  try {
    const validation = validateVisitorEventPayload(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid event data.",
        errors: validation.errors,
      });
    }

    const data = {
      ...req.body,
      pagePath: sanitizeString(req.body.pagePath || "", 500),
    };

    const event = await recordVisitorEvent(data);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Visitor session not found or expired.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Visitor event recorded.",
    });
  } catch (error) {
    next(error);
  }
};

///////////////
// ============================================
// ADMIN: VISITORS OVERVIEW
// ============================================

export const getAdminVisitorsOverview = async (req, res, next) => {
  try {
    const overview = await getVisitorsOverview();

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ADMIN: VISITORS LIST
// ============================================

export const getAdminVisitorsList = async (req, res, next) => {
  try {
    const {
      search = "",
      device = "",
      browser = "",
      os = "",
      visitorType = "",
      startDate = "",
      endDate = "",
      page = "1",
      limit = "20",
      sort = "last_seen",
      order = "desc",
    } = req.query;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1 ||
      parsedPage > 100000
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid page number.",
      });
    }

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid page limit.",
      });
    }

    const allowedSortFields = [
      "first_seen",
      "last_seen",
      "sessions",
      "page_views",
    ];

    const allowedDevices = ["", "desktop", "mobile", "tablet", "other"];

    const allowedVisitorTypes = ["", "new", "returning"];

    const allowedOrders = ["asc", "desc"];

    if (!allowedSortFields.includes(sort)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort field.",
      });
    }

    if (!allowedDevices.includes(device)) {
      return res.status(400).json({
        success: false,
        message: "Invalid device filter.",
      });
    }

    if (!allowedVisitorTypes.includes(visitorType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visitor type.",
      });
    }

    if (!allowedOrders.includes(order)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort order.",
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (startDate && !dateRegex.test(startDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date.",
      });
    }

    if (endDate && !dateRegex.test(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid end date.",
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date.",
      });
    }

    const result = await getVisitorsList({
      search,
      device,
      browser,
      os,
      visitorType,
      startDate,
      endDate,
      page: parsedPage,
      limit: parsedLimit,
      sort,
      order,
    });

    return res.status(200).json({
      success: true,
      data: result.visitors,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ADMIN: VISITOR DETAILS
// ============================================

export const getAdminVisitorDetails = async (req, res, next) => {
  try {
    const visitorDatabaseId = Number(req.params.id);

    if (!Number.isSafeInteger(visitorDatabaseId) || visitorDatabaseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid visitor ID.",
      });
    }

    const result = await getVisitorDetails(visitorDatabaseId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
