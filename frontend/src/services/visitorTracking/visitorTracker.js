import { getVisitorId } from "./visitorIdentity";
import { getSessionId } from "./visitorSession";
import { getVisitorDeviceInfo } from "./visitorDetection";
import { getVisitorAttribution } from "./visitorAttribution";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const isTrackingEnabled = () => {
  try {
    return (
      typeof window !== "undefined" &&
      typeof localStorage !== "undefined" &&
      !localStorage.getItem("portfolio_tracking_disabled")
    );
  } catch {
    return false;
  }
};

const sendTrackingRequest = async (endpoint, payload) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch {
    // Tracking failure must not interrupt the Portfolio.
    return false;
  }
};

export const trackPageView = async ({ pagePath, pageTitle }) => {
  if (!isTrackingEnabled()) return;

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  if (!visitorId || !sessionId) return;

  const deviceInfo = getVisitorDeviceInfo();
  const attribution = getVisitorAttribution(sessionId);

  const payload = {
    visitorId,
    sessionId,
    pagePath,
    pageTitle,
    ...deviceInfo,
    ...attribution,
  };

  return sendTrackingRequest("/visitors/track", payload);
};

export const trackEvent = async ({
  eventName,
  eventCategory,
  pagePath,
  eventData = {},
}) => {
  if (!isTrackingEnabled()) return;

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  if (!visitorId || !sessionId) return;

  const payload = {
    visitorId,
    sessionId,
    eventName,
    eventCategory,
    pagePath,
    eventData,
  };

  return sendTrackingRequest("/visitors/events", payload);
};
