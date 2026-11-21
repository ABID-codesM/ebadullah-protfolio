// const ATTRIBUTION_STORAGE_KEY = "portfolio_attribution";

// const SEARCH_ENGINES = [
//   "google.",
//   "bing.com",
//   "yahoo.",
//   "duckduckgo.com",
//   "yandex.",
//   "baidu.",
// ];

// const SOCIAL_DOMAINS = [
//   "facebook.com",
//   "instagram.com",
//   "linkedin.com",
//   "twitter.com",
//   "x.com",
//   "tiktok.com",
//   "youtube.com",
//   "github.com",
//   "t.me",
// ];

// const getHostname = (url) => {
//   try {
//     return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
//   } catch {
//     return null;
//   }
// };

// const getStoredAttribution = () => {
//   try {
//     const stored = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);

//     return stored ? JSON.parse(stored) : null;
//   } catch {
//     return null;
//   }
// };

// export const getVisitorAttribution = () => {
//   const params = new URLSearchParams(window.location.search);

//   const utmSource = params.get("utm_source");
//   const utmMedium = params.get("utm_medium");
//   const utmCampaign = params.get("utm_campaign");

//   const referrer = document.referrer;
//   const referrerDomain = getHostname(referrer);

//   let source = "direct";
//   let medium = null;
//   let campaign = null;

//   if (utmSource) {
//     source = "campaign";
//     medium = utmMedium || "unknown";
//     campaign = utmCampaign || null;
//   } else if (referrerDomain) {
//     if (SEARCH_ENGINES.some((domain) => referrerDomain.includes(domain))) {
//       source = "search";
//       medium = "organic";
//     } else if (
//       SOCIAL_DOMAINS.some(
//         (domain) =>
//           referrerDomain === domain || referrerDomain.endsWith(`.${domain}`),
//       )
//     ) {
//       source = "social";
//       medium = "social";
//     } else {
//       source = "referral";
//       medium = "referral";
//     }
//   }

//   const currentAttribution = {
//     source,
//     medium,
//     campaign,
//     referrerDomain,
//   };

//   // Preserve the original acquisition attribution.
//   const existingAttribution = getStoredAttribution();

//   if (existingAttribution) {
//     return existingAttribution;
//   }

//   try {
//     localStorage.setItem(
//       ATTRIBUTION_STORAGE_KEY,
//       JSON.stringify(currentAttribution),
//     );
//   } catch {
//     // Tracking storage may be unavailable.
//   }

//   return currentAttribution;
// };

const ATTRIBUTION_STORAGE_KEY = "portfolio_session_attribution";

const SEARCH_ENGINES = [
  "google.",
  "bing.com",
  "yahoo.",
  "duckduckgo.com",
  "yandex.",
  "baidu.",
];

const SOCIAL_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "youtube.com",
  "github.com",
  "t.me",
];

const getHostname = (url) => {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
};

const detectSource = (referrerDomain) => {
  if (!referrerDomain) {
    return {
      source: "direct",
      medium: null,
    };
  }

  if (SEARCH_ENGINES.some((domain) => referrerDomain.includes(domain))) {
    return {
      source: "search",
      medium: "organic",
    };
  }

  if (
    SOCIAL_DOMAINS.some(
      (domain) =>
        referrerDomain === domain || referrerDomain.endsWith(`.${domain}`),
    )
  ) {
    return {
      source: "social",
      medium: "social",
    };
  }

  return {
    source: "referral",
    medium: "referral",
  };
};

export const getVisitorAttribution = (sessionId) => {
  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);

      if (parsed.sessionId === sessionId) {
        return parsed.attribution;
      }
    }
  } catch {
    // Continue with fresh attribution.
  }

  const params = new URLSearchParams(window.location.search);

  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");

  const referrerDomain = getHostname(document.referrer);

  let attribution;

  if (utmSource) {
    attribution = {
      source: "campaign",
      medium: utmMedium || "unknown",
      campaign: utmCampaign || null,
      referrerDomain,
    };
  } else {
    const detected = detectSource(referrerDomain);

    attribution = {
      ...detected,
      campaign: null,
      referrerDomain,
    };
  }

  sessionStorage.setItem(
    ATTRIBUTION_STORAGE_KEY,
    JSON.stringify({
      sessionId,
      attribution,
    }),
  );

  return attribution;
};
