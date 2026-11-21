const SESSION_STORAGE_KEY = "portfolio_session_id";
const LAST_ACTIVITY_KEY = "portfolio_last_activity";

const SESSION_TIMEOUT = 30 * 60 * 1000;

const createSessionId = () => crypto.randomUUID();

export const getSessionId = () => {
  try {
    const now = Date.now();

    const existingSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);

    const lastActivity = Number(sessionStorage.getItem(LAST_ACTIVITY_KEY));

    const isSessionExpired =
      !lastActivity || now - lastActivity >= SESSION_TIMEOUT;

    if (!existingSessionId || isSessionExpired) {
      const newSessionId = createSessionId();

      sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);

      sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now));

      return newSessionId;
    }

    sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now));

    return existingSessionId;
  } catch (error) {
    console.error("Session initialization failed:", error);
    return null;
  }
};

export const updateSessionActivity = () => {
  try {
    sessionStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  } catch (error) {
    console.error("Session activity update failed:", error);
  }
};
