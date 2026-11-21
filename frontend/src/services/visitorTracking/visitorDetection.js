const getUserAgent = () => navigator.userAgent || "";

export const detectDeviceType = () => {
  const userAgent = getUserAgent().toLowerCase();

  if (/ipad|tablet/.test(userAgent)) {
    return "tablet";
  }

  if (/mobile|iphone|android/.test(userAgent)) {
    return "mobile";
  }

  return "desktop";
};

export const detectBrowser = () => {
  const userAgent = getUserAgent();

  if (/Edg\//.test(userAgent)) return "Edge";
  if (/OPR\/|Opera/.test(userAgent)) return "Opera";
  if (/Firefox\//.test(userAgent)) return "Firefox";
  if (/Chrome\//.test(userAgent)) return "Chrome";
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) {
    return "Safari";
  }

  return "Unknown";
};

export const detectOperatingSystem = () => {
  const userAgent = getUserAgent();

  if (/Windows/.test(userAgent)) return "Windows";
  if (/Android/.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";
  if (/Mac OS/.test(userAgent)) return "macOS";
  if (/Linux/.test(userAgent)) return "Linux";

  return "Unknown";
};

export const getVisitorDeviceInfo = () => {
  return {
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
    operatingSystem: detectOperatingSystem(),
  };
};
