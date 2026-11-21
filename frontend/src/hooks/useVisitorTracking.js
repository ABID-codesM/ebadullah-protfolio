import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "../services/visitorTracking/visitorTracker";

// Prevent duplicate page-view requests during React StrictMode checks.
let lastTrackedPage = "";
let lastTrackedTime = 0;

const ADMIN_PREFIXES = ["/admin", "/dashboard"];

const isAdminRoute = (pathname) => {
  return ADMIN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
};

export const useVisitorTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    // Admin routes must never be tracked.
    if (isAdminRoute(pathname)) return;

    const pageTitle = document.title || "Portfolio";

    const now = Date.now();
    const trackingKey = `${pathname}|${pageTitle}`;

    // Prevent immediate duplicate requests.
    if (trackingKey === lastTrackedPage && now - lastTrackedTime < 1500) {
      return;
    }

    lastTrackedPage = trackingKey;
    lastTrackedTime = now;

    trackPageView({
      pagePath: pathname,
      pageTitle,
    });
  }, [location.pathname]);
};
