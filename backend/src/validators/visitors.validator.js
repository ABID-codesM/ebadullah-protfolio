const ALLOWED_DEVICE_TYPES = ["desktop", "mobile", "tablet", "other"];

const ALLOWED_EVENT_NAMES = [
  "project_view",
  "contact_view",
  "social_click",
  "resume_download",
];

const ALLOWED_SOURCE_TYPES = [
  "direct",
  "search",
  "social",
  "referral",
  "campaign",
  "unknown",
];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUUID = (value) => {
  return typeof value === "string" && UUID_REGEX.test(value);
};

const isValidString = (value, maxLength = 500) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
};

const sanitizeString = (value, maxLength = 500) => {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .slice(0, maxLength);
};

export const validateTrackingPayload = (data) => {
  const errors = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      valid: false,
      errors: ["Invalid request body."],
    };
  }

  if (!isValidUUID(data.visitorId)) {
    errors.push("Invalid visitorId.");
  }

  if (!isValidUUID(data.sessionId)) {
    errors.push("Invalid sessionId.");
  }

  if (!isValidString(data.pagePath, 500)) {
    errors.push("Invalid pagePath.");
  }

  if (
    data.pageTitle !== undefined &&
    data.pageTitle !== null &&
    typeof data.pageTitle !== "string"
  ) {
    errors.push("Invalid pageTitle.");
  }

  if (
    data.deviceType !== undefined &&
    data.deviceType !== null &&
    !ALLOWED_DEVICE_TYPES.includes(data.deviceType)
  ) {
    errors.push("Invalid deviceType.");
  }

  if (
    data.browser !== undefined &&
    data.browser !== null &&
    typeof data.browser !== "string"
  ) {
    errors.push("Invalid browser.");
  }

  if (
    data.operatingSystem !== undefined &&
    data.operatingSystem !== null &&
    typeof data.operatingSystem !== "string"
  ) {
    errors.push("Invalid operatingSystem.");
  }

  if (
    data.source !== undefined &&
    data.source !== null &&
    !ALLOWED_SOURCE_TYPES.includes(data.source)
  ) {
    errors.push("Invalid source.");
  }

  if (
    data.medium !== undefined &&
    data.medium !== null &&
    typeof data.medium !== "string"
  ) {
    errors.push("Invalid medium.");
  }

  if (
    data.campaign !== undefined &&
    data.campaign !== null &&
    typeof data.campaign !== "string"
  ) {
    errors.push("Invalid campaign.");
  }

  if (
    data.referrerDomain !== undefined &&
    data.referrerDomain !== null &&
    typeof data.referrerDomain !== "string"
  ) {
    errors.push("Invalid referrerDomain.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateVisitorEventPayload = (data) => {
  const errors = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      valid: false,
      errors: ["Invalid request body."],
    };
  }

  if (!isValidUUID(data.visitorId)) {
    errors.push("Invalid visitorId.");
  }

  if (!isValidUUID(data.sessionId)) {
    errors.push("Invalid sessionId.");
  }

  if (!ALLOWED_EVENT_NAMES.includes(data.eventName)) {
    errors.push("Unsupported eventName.");
  }

  if (
    data.pagePath !== undefined &&
    data.pagePath !== null &&
    typeof data.pagePath !== "string"
  ) {
    errors.push("Invalid pagePath.");
  }

  if (
    data.eventData !== undefined &&
    (typeof data.eventData !== "object" ||
      data.eventData === null ||
      Array.isArray(data.eventData))
  ) {
    errors.push("Invalid eventData.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export {
  ALLOWED_DEVICE_TYPES,
  ALLOWED_EVENT_NAMES,
  ALLOWED_SOURCE_TYPES,
  isValidUUID,
  sanitizeString,
};
