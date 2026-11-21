const VISITOR_STORAGE_KEY = "portfolio_visitor_id";

export const getVisitorId = () => {
  try {
    let visitorId = localStorage.getItem(VISITOR_STORAGE_KEY);

    if (!visitorId) {
      visitorId = crypto.randomUUID();

      localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
    }

    return visitorId;
  } catch (error) {
    console.error("Visitor ID initialization failed:", error);
    return null;
  }
};
