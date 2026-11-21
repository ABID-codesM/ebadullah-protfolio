// import pool from "../config/db.js";

// const SESSION_TIMEOUT_MINUTES = 30;

// /**
//  * Tracks a visitor and their session.
//  * Creates a new session if the previous session is inactive.
//  */
// export const trackVisitor = async (data) => {
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     // 1. Create or retrieve visitor
//     const visitorResult = await client.query(
//       `
//       INSERT INTO visitors (visitor_id)
//       VALUES ($1)
//       ON CONFLICT (visitor_id)
//       DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP
//       RETURNING id, visitor_id, first_seen_at, last_seen_at
//       `,
//       [data.visitorId],
//     );

//     const visitor = visitorResult.rows[0];

//     // 2. Check existing active session
//     const sessionResult = await client.query(
//       `
//       SELECT id, session_id, started_at, last_activity_at
//       FROM visitor_sessions
//       WHERE visitor_id = $1
//         AND session_id = $2
//         AND ended_at IS NULL
//         AND last_activity_at >=
//           CURRENT_TIMESTAMP - ($3 * INTERVAL '1 minute')
//       FOR UPDATE
//       `,
//       [visitor.id, data.sessionId, SESSION_TIMEOUT_MINUTES],
//     );

//     let session;
//     let isNewSession = false;

//     if (sessionResult.rows.length > 0) {
//       session = sessionResult.rows[0];

//       // 3. Update existing session activity
//       await client.query(
//         `
//         UPDATE visitor_sessions
//         SET last_activity_at = CURRENT_TIMESTAMP
//         WHERE id = $1
//         `,
//         [session.id],
//       );
//     } else {
//       // 4. Create new session
//       const newSessionResult = await client.query(
//         `
//         INSERT INTO visitor_sessions (
//           session_id,
//           visitor_id,
//           source,
//           medium,
//           campaign,
//           referrer_domain,
//           device_type,
//           browser,
//           operating_system
//         )
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
//         RETURNING id, session_id, started_at, last_activity_at
//         `,
//         [
//           data.sessionId,
//           visitor.id,
//           data.source || "unknown",
//           data.medium || null,
//           data.campaign || null,
//           data.referrerDomain || null,
//           data.deviceType || "other",
//           data.browser || null,
//           data.operatingSystem || null,
//         ],
//       );

//       session = newSessionResult.rows[0];
//       isNewSession = true;
//     }

//     // 5. Record page view
//     await client.query(
//       `
//       INSERT INTO page_views (
//         session_id,
//         page_path,
//         page_title
//       )
//       VALUES ($1, $2, $3)
//       `,
//       [session.id, data.pagePath, data.pageTitle || null],
//     );

//     await client.query("COMMIT");

//     return {
//       visitor,
//       session,
//       isNewSession,
//     };
//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// /**
//  * Records an event for an existing visitor session.
//  */
// export const recordVisitorEvent = async (data) => {
//   const result = await pool.query(
//     `
//     INSERT INTO visitor_events (
//       session_id,
//       event_name,
//       event_category,
//       page_path,
//       event_data
//     )
//     SELECT
//       s.id,
//       $3,
//       $4,
//       $5,
//       $6::jsonb
//     FROM visitor_sessions s
//     JOIN visitors v ON v.id = s.visitor_id
//     WHERE v.visitor_id = $1
//       AND s.session_id = $2
//       AND s.ended_at IS NULL
//       AND s.last_activity_at >=
//         CURRENT_TIMESTAMP - ($7 * INTERVAL '1 minute')
//     RETURNING id, event_name, occurred_at
//     `,
//     [
//       data.visitorId,
//       data.sessionId,
//       data.eventName,
//       data.eventCategory || null,
//       data.pagePath || null,
//       JSON.stringify(data.eventData || {}),
//       SESSION_TIMEOUT_MINUTES,
//     ],
//   );

//   if (result.rows.length === 0) {
//     return null;
//   }

//   return result.rows[0];
// };
// ////////////////////////////////

// // ADMIN: VISITORS OVERVIEW
// // ============================================

// export const getVisitorsOverview = async () => {
//   const result = await pool.query(`
//     SELECT
//       (SELECT COUNT(*) FROM visitors) AS total_visitors,

//       (SELECT COUNT(*) FROM visitor_sessions) AS total_sessions,

//       (SELECT COUNT(*) FROM page_views) AS total_page_views,

//       (
//         SELECT COUNT(*)
//         FROM visitors
//         WHERE first_seen_at >= CURRENT_DATE
//       ) AS new_visitors_today,

//       (
//         SELECT COUNT(*)
//         FROM visitors
//         WHERE first_seen_at < CURRENT_DATE
//       ) AS returning_visitors,

//       (
//         SELECT COUNT(*)
//         FROM visitor_sessions
//         WHERE last_activity_at >= NOW() - INTERVAL '5 minutes'
//           AND ended_at IS NULL
//       ) AS active_visitors,

//       (
//         SELECT COUNT(*)
//         FROM visitor_sessions
//         WHERE started_at >= CURRENT_DATE
//       ) AS sessions_today,

//       (
//         SELECT COUNT(*)
//         FROM page_views
//         WHERE viewed_at >= CURRENT_DATE
//       ) AS page_views_today
//   `);

//   return result.rows[0];
// };

// // ============================================
// // ADMIN: VISITORS LIST
// // ============================================

// export const getVisitorsList = async ({
//   search = "",
//   device = "",
//   page = 1,
//   limit = 20,
//   sort = "last_seen",
//   order = "desc",
// } = {}) => {
//   const allowedSortFields = {
//     first_seen: "v.first_seen_at",
//     last_seen: "v.last_seen_at",
//     sessions: "total_sessions",
//     page_views: "total_page_views",
//   };

//   const sortColumn = allowedSortFields[sort] || allowedSortFields.last_seen;

//   const sortOrder = order === "asc" ? "ASC" : "DESC";

//   const offset = (page - 1) * limit;

//   const conditions = [];
//   const values = [];

//   if (search.trim()) {
//     values.push(`%${search.trim()}%`);

//     conditions.push(`
//       CAST(v.visitor_id AS TEXT) ILIKE $${values.length}
//     `);
//   }

//   if (device && ["desktop", "mobile", "tablet", "other"].includes(device)) {
//     values.push(device);

//     conditions.push(`
//       EXISTS (
//         SELECT 1
//         FROM visitor_sessions ds
//         WHERE ds.visitor_id = v.id
//           AND ds.device_type = $${values.length}
//       )
//     `);
//   }

//   const whereClause = conditions.length
//     ? `WHERE ${conditions.join(" AND ")}`
//     : "";

//   const countResult = await pool.query(
//     `
//     SELECT COUNT(*) AS total
//     FROM visitors v
//     ${whereClause}
//     `,
//     values,
//   );

//   const total = Number(countResult.rows[0].total);

//   const listValues = [...values, limit, offset];

//   const result = await pool.query(
//     `
//     SELECT
//       v.id,
//       v.visitor_id,
//       v.first_seen_at,
//       v.last_seen_at,

//       COUNT(DISTINCT s.id) AS total_sessions,

//       COUNT(DISTINCT pv.id) AS total_page_views,

//       COUNT(DISTINCT s.id) FILTER (
//         WHERE s.last_activity_at >= NOW() - INTERVAL '5 minutes'
//           AND s.ended_at IS NULL
//       ) AS active_sessions,

//       (
//         SELECT ss.device_type
//         FROM visitor_sessions ss
//         WHERE ss.visitor_id = v.id
//         ORDER BY ss.started_at DESC
//         LIMIT 1
//       ) AS last_device,

//       (
//         SELECT ss.browser
//         FROM visitor_sessions ss
//         WHERE ss.visitor_id = v.id
//         ORDER BY ss.started_at DESC
//         LIMIT 1
//       ) AS last_browser,

//       (
//         SELECT ss.operating_system
//         FROM visitor_sessions ss
//         WHERE ss.visitor_id = v.id
//         ORDER BY ss.started_at DESC
//         LIMIT 1
//       ) AS last_os

//     FROM visitors v

//     LEFT JOIN visitor_sessions s
//       ON s.visitor_id = v.id

//     LEFT JOIN page_views pv
//       ON pv.session_id = s.id

//     ${whereClause}

//     GROUP BY
//       v.id,
//       v.visitor_id,
//       v.first_seen_at,
//       v.last_seen_at

//     ORDER BY ${sortColumn} ${sortOrder}

//     LIMIT $${listValues.length - 1}
//     OFFSET $${listValues.length}
//     `,
//     listValues,
//   );

//   return {
//     visitors: result.rows,
//     pagination: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// };

// // ============================================
// // ADMIN: VISITOR DETAILS
// // ============================================

// export const getVisitorDetails = async (visitorDatabaseId) => {
//   const visitorResult = await pool.query(
//     `
//     SELECT
//       v.id,
//       v.visitor_id,
//       v.first_seen_at,
//       v.last_seen_at,
//       v.created_at,

//       COUNT(DISTINCT s.id) AS total_sessions,
//       COUNT(DISTINCT pv.id) AS total_page_views,
//       COUNT(DISTINCT e.id) AS total_events

//     FROM visitors v

//     LEFT JOIN visitor_sessions s
//       ON s.visitor_id = v.id

//     LEFT JOIN page_views pv
//       ON pv.session_id = s.id

//     LEFT JOIN visitor_events e
//       ON e.session_id = s.id

//     WHERE v.id = $1

//     GROUP BY v.id
//     `,
//     [visitorDatabaseId],
//   );

//   if (visitorResult.rows.length === 0) {
//     return null;
//   }

//   const visitor = visitorResult.rows[0];

//   // Sessions
//   const sessionsResult = await pool.query(
//     `
//     SELECT
//       id,
//       session_id,
//       started_at,
//       last_activity_at,
//       ended_at,
//       source,
//       medium,
//       campaign,
//       referrer_domain,
//       device_type,
//       browser,
//       operating_system

//     FROM visitor_sessions

//     WHERE visitor_id = $1

//     ORDER BY started_at DESC
//     `,
//     [visitorDatabaseId],
//   );

//   // Page Views
//   const pageViewsResult = await pool.query(
//     `
//     SELECT
//       pv.id,
//       pv.page_path,
//       pv.page_title,
//       pv.viewed_at,
//       pv.duration_seconds,
//       s.session_id

//     FROM page_views pv

//     JOIN visitor_sessions s
//       ON s.id = pv.session_id

//     WHERE s.visitor_id = $1

//     ORDER BY pv.viewed_at DESC
//     LIMIT 100
//     `,
//     [visitorDatabaseId],
//   );

//   // Events
//   const eventsResult = await pool.query(
//     `
//     SELECT
//       e.id,
//       e.event_name,
//       e.event_category,
//       e.page_path,
//       e.event_data,
//       e.occurred_at,
//       s.session_id

//     FROM visitor_events e

//     JOIN visitor_sessions s
//       ON s.id = e.session_id

//     WHERE s.visitor_id = $1

//     ORDER BY e.occurred_at DESC
//     LIMIT 100
//     `,
//     [visitorDatabaseId],
//   );

//   return {
//     visitor,
//     sessions: sessionsResult.rows,
//     pageViews: pageViewsResult.rows,
//     events: eventsResult.rows,
//   };
// };
import pool from "../config/db.js";

const SESSION_TIMEOUT_MINUTES = 30;

// ============================================================
// 1. TRACK VISITOR
// Existing tracking engine preserved
// ============================================================

export const trackVisitor = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const visitorResult = await client.query(
      `
      INSERT INTO visitors (visitor_id)
      VALUES ($1)
      ON CONFLICT (visitor_id)
      DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP
      RETURNING id, visitor_id, first_seen_at, last_seen_at
      `,
      [data.visitorId],
    );

    const visitor = visitorResult.rows[0];

    const activeSessionResult = await client.query(
      `
      SELECT id, session_id
      FROM visitor_sessions
      WHERE visitor_id = $1
        AND session_id = $2
        AND ended_at IS NULL
        AND last_activity_at >=
            CURRENT_TIMESTAMP - ($3 * INTERVAL '1 minute')
      FOR UPDATE
      `,
      [visitor.id, data.sessionId, SESSION_TIMEOUT_MINUTES],
    );

    let session;

    if (activeSessionResult.rows.length > 0) {
      session = activeSessionResult.rows[0];

      await client.query(
        `
        UPDATE visitor_sessions
        SET last_activity_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [session.id],
      );
    } else {
      const sessionResult = await client.query(
        `
        INSERT INTO visitor_sessions (
          session_id,
          visitor_id,
          source,
          medium,
          campaign,
          referrer_domain,
          device_type,
          browser,
          operating_system
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, session_id, started_at
        `,
        [
          data.sessionId,
          visitor.id,
          data.source || null,
          data.medium || null,
          data.campaign || null,
          data.referrerDomain || null,
          data.deviceType || null,
          data.browser || null,
          data.operatingSystem || null,
        ],
      );

      session = sessionResult.rows[0];
    }

    const pageViewResult = await client.query(
      `
      INSERT INTO page_views (
        session_id,
        page_path,
        page_title
      )
      VALUES ($1, $2, $3)
      RETURNING id, session_id, page_path, page_title, viewed_at
      `,
      [session.id, data.pagePath, data.pageTitle || null],
    );

    await client.query("COMMIT");

    return {
      visitor,
      session,
      pageView: pageViewResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ============================================================
// 2. RECORD VISITOR EVENT
// Existing event tracking preserved
// ============================================================

export const recordVisitorEvent = async (data) => {
  const result = await pool.query(
    `
    INSERT INTO visitor_events (
      session_id,
      event_name,
      event_category,
      page_path,
      event_data
    )
    SELECT
      s.id,
      $3,
      $4,
      $5,
      $6::jsonb
    FROM visitors v
    JOIN visitor_sessions s
      ON s.visitor_id = v.id
    WHERE v.visitor_id = $1
      AND s.session_id = $2
      AND s.ended_at IS NULL
      AND s.last_activity_at >=
          CURRENT_TIMESTAMP - ($7 * INTERVAL '1 minute')
    RETURNING
      id,
      session_id,
      event_name,
      event_category,
      page_path,
      event_data,
      occurred_at
    `,
    [
      data.visitorId,
      data.sessionId,
      data.eventName,
      data.eventCategory || null,
      data.pagePath || null,
      JSON.stringify(data.eventData || {}),
      SESSION_TIMEOUT_MINUTES,
    ],
  );

  return result.rows[0] || null;
};

// ============================================================
// 3. ADMIN OVERVIEW
// ============================================================

export const getVisitorsOverview = async () => {
  const result = await pool.query(
    `
    SELECT

      -- Total unique visitors
      (
        SELECT COUNT(*)
        FROM visitors
      ) AS total_visitors,

      -- Total sessions
      (
        SELECT COUNT(*)
        FROM visitor_sessions
      ) AS total_sessions,

      -- Total page views
      (
        SELECT COUNT(*)
        FROM page_views
      ) AS total_page_views,

      -- New visitors today
      (
        SELECT COUNT(*)
        FROM visitors
        WHERE first_seen_at >= CURRENT_DATE
          AND first_seen_at < CURRENT_DATE + INTERVAL '1 day'
      ) AS new_visitors_today,

      -- Returning visitors (visitors with 2+ sessions)
      (
        SELECT COUNT(*)
        FROM (
          SELECT visitor_id
          FROM visitor_sessions
          GROUP BY visitor_id
          HAVING COUNT(*) >= 2
        ) returning_visitors
      ) AS returning_visitors,

      -- Active unique visitors in last 5 minutes
      (
        SELECT COUNT(DISTINCT visitor_id)
        FROM visitor_sessions
        WHERE ended_at IS NULL
          AND last_activity_at >=
              CURRENT_TIMESTAMP - INTERVAL '5 minutes'
      ) AS active_visitors,

      -- Sessions today
      (
        SELECT COUNT(*)
        FROM visitor_sessions
        WHERE started_at >= CURRENT_DATE
          AND started_at < CURRENT_DATE + INTERVAL '1 day'
      ) AS sessions_today,

      -- Page views today
      (
        SELECT COUNT(*)
        FROM page_views
        WHERE viewed_at >= CURRENT_DATE
          AND viewed_at < CURRENT_DATE + INTERVAL '1 day'
      ) AS page_views_today
    `,
  );

  return result.rows[0];
};

// ============================================================
// 4. ADMIN VISITORS LIST
// Search / Filters / Sorting / Pagination
// ============================================================

export const getVisitorsList = async ({
  search = "",
  device = "",
  browser = "",
  os = "",
  visitorType = "",
  startDate = "",
  endDate = "",
  page = 1,
  limit = 20,
  sort = "last_seen",
  order = "desc",
}) => {
  const allowedSortFields = {
    first_seen: "v.first_seen_at",
    last_seen: "v.last_seen_at",
    sessions: "total_sessions",
    page_views: "total_page_views",
  };

  const allowedDevices = ["desktop", "mobile", "tablet", "other"];

  const normalizedDevice = allowedDevices.includes(device) ? device : "";

  const normalizedVisitorType = ["new", "returning"].includes(visitorType)
    ? visitorType
    : "";

  const safeSort = allowedSortFields[sort] ? sort : "last_seen";

  const safeOrder = order === "asc" ? "ASC" : "DESC";

  const safePage = Math.max(1, Number(page) || 1);

  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));

  const offset = (safePage - 1) * safeLimit;

  // ----------------------------------------------------------
  // WHERE CONDITIONS
  // ----------------------------------------------------------

  const conditions = [];
  const values = [];

  const addCondition = (condition, value) => {
    values.push(value);
    conditions.push(condition.replace("?", `$${values.length}`));
  };

  // Visitor ID search
  if (search.trim()) {
    addCondition("CAST(v.visitor_id AS TEXT) ILIKE ?", `%${search.trim()}%`);
  }

  // Date range: visitors active during the selected period
  if (startDate) {
    addCondition("v.last_seen_at >= ?::date", startDate);
  }

  if (endDate) {
    addCondition("v.last_seen_at < (?::date + INTERVAL '1 day')", endDate);
  }

  // Device filter
  if (normalizedDevice) {
    addCondition(
      `
      EXISTS (
        SELECT 1
        FROM visitor_sessions ds
        WHERE ds.visitor_id = v.id
          AND ds.device_type = ?
      )
      `,
      normalizedDevice,
    );
  }

  // Browser filter
  if (browser.trim()) {
    addCondition(
      `
      EXISTS (
        SELECT 1
        FROM visitor_sessions bs
        WHERE bs.visitor_id = v.id
          AND bs.browser ILIKE ?
      )
      `,
      `%${browser.trim()}%`,
    );
  }

  // Operating system filter
  if (os.trim()) {
    addCondition(
      `
      EXISTS (
        SELECT 1
        FROM visitor_sessions oss
        WHERE oss.visitor_id = v.id
          AND oss.operating_system ILIKE ?
      )
      `,
      `%${os.trim()}%`,
    );
  }

  // Visitor type filter
  if (normalizedVisitorType === "new") {
    conditions.push(
      `
      NOT EXISTS (
        SELECT 1
        FROM visitor_sessions nts
        WHERE nts.visitor_id = v.id
        GROUP BY nts.visitor_id
        HAVING COUNT(*) >= 2
      )
      `,
    );
  }

  if (normalizedVisitorType === "returning") {
    conditions.push(
      `
      EXISTS (
        SELECT 1
        FROM visitor_sessions rts
        WHERE rts.visitor_id = v.id
        GROUP BY rts.visitor_id
        HAVING COUNT(*) >= 2
      )
      `,
    );
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // ----------------------------------------------------------
  // TOTAL COUNT
  // ----------------------------------------------------------

  const countResult = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM visitors v
    ${whereClause}
    `,
    values,
  );

  const total = Number(countResult.rows[0].total);

  // ----------------------------------------------------------
  // VISITOR LIST
  // ----------------------------------------------------------

  const listValues = [...values, safeLimit, offset];

  const limitParam = values.length + 1;
  const offsetParam = values.length + 2;

  const sortExpression = allowedSortFields[safeSort];

  const visitorsResult = await pool.query(
    `
    SELECT
      v.id,
      v.visitor_id,
      v.first_seen_at,
      v.last_seen_at,

      COALESCE(ss.total_sessions, 0)::int
        AS total_sessions,

      COALESCE(pv.total_page_views, 0)::int
        AS total_page_views,

      COALESCE(ss.active_sessions, 0)::int
        AS active_sessions,

      ls.device_type AS last_device,
      ls.browser AS last_browser,
      ls.operating_system AS last_os,

      CASE
        WHEN COALESCE(ss.total_sessions, 0) >= 2
        THEN 'returning'
        ELSE 'new'
      END AS visitor_type

    FROM visitors v

    LEFT JOIN LATERAL (
      SELECT
        COUNT(*) AS total_sessions,
        COUNT(*) FILTER (
          WHERE ended_at IS NULL
            AND last_activity_at >=
                CURRENT_TIMESTAMP - INTERVAL '5 minutes'
        ) AS active_sessions
      FROM visitor_sessions
      WHERE visitor_id = v.id
    ) ss ON TRUE

    LEFT JOIN LATERAL (
      SELECT COUNT(*) AS total_page_views
      FROM page_views pv
      JOIN visitor_sessions ps
        ON ps.id = pv.session_id
      WHERE ps.visitor_id = v.id
    ) pv ON TRUE

    LEFT JOIN LATERAL (
      SELECT
        device_type,
        browser,
        operating_system
      FROM visitor_sessions
      WHERE visitor_id = v.id
      ORDER BY started_at DESC
      LIMIT 1
    ) ls ON TRUE

    ${whereClause}

    ORDER BY ${sortExpression} ${safeOrder},
             v.id ${safeOrder}

    LIMIT $${limitParam}
    OFFSET $${offsetParam}
    `,
    listValues,
  );

  return {
    visitors: visitorsResult.rows,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

// ============================================================
// 5. VISITOR DETAILS
// Avoid JOIN multiplication
// ============================================================

export const getVisitorDetails = async (visitorDatabaseId) => {
  // ----------------------------------------------------------
  // VISITOR SUMMARY
  // ----------------------------------------------------------

  const visitorResult = await pool.query(
    `
    SELECT
      v.id,
      v.visitor_id,
      v.first_seen_at,
      v.last_seen_at,

      (
        SELECT COUNT(*)
        FROM visitor_sessions s
        WHERE s.visitor_id = v.id
      ) AS total_sessions,

      (
        SELECT COUNT(*)
        FROM visitor_sessions s
        JOIN page_views pv
          ON pv.session_id = s.id
        WHERE s.visitor_id = v.id
      ) AS total_page_views,

      (
        SELECT COUNT(*)
        FROM visitor_sessions s
        JOIN visitor_events e
          ON e.session_id = s.id
        WHERE s.visitor_id = v.id
      ) AS total_events

    FROM visitors v
    WHERE v.id = $1
    LIMIT 1
    `,
    [visitorDatabaseId],
  );

  const visitor = visitorResult.rows[0];

  if (!visitor) {
    return null;
  }

  // ----------------------------------------------------------
  // SESSIONS
  // ----------------------------------------------------------

  const sessionsResult = await pool.query(
    `
    SELECT
      s.id,
      s.session_id,
      s.started_at,
      s.last_activity_at,
      s.ended_at,

      s.source,
      s.medium,
      s.campaign,
      s.referrer_domain,

      s.device_type,
      s.browser,
      s.operating_system,

      (
        SELECT COUNT(*)
        FROM page_views pv
        WHERE pv.session_id = s.id
      ) AS page_views_count,

      (
        SELECT COUNT(*)
        FROM visitor_events e
        WHERE e.session_id = s.id
      ) AS events_count

    FROM visitor_sessions s

    WHERE s.visitor_id = $1

    ORDER BY s.started_at DESC

    LIMIT 100
    `,
    [visitorDatabaseId],
  );

  // ----------------------------------------------------------
  // PAGE VIEWS
  // ----------------------------------------------------------

  const pageViewsResult = await pool.query(
    `
    SELECT
      pv.id,
      pv.page_path,
      pv.page_title,
      pv.viewed_at,
      pv.duration_seconds,
      s.session_id

    FROM page_views pv

    JOIN visitor_sessions s
      ON s.id = pv.session_id

    WHERE s.visitor_id = $1

    ORDER BY pv.viewed_at DESC

    LIMIT 100
    `,
    [visitorDatabaseId],
  );

  // ----------------------------------------------------------
  // EVENTS
  // ----------------------------------------------------------

  const eventsResult = await pool.query(
    `
    SELECT
      e.id,
      e.event_name,
      e.event_category,
      e.page_path,
      e.event_data,
      e.occurred_at,
      s.session_id

    FROM visitor_events e

    JOIN visitor_sessions s
      ON s.id = e.session_id

    WHERE s.visitor_id = $1

    ORDER BY e.occurred_at DESC

    LIMIT 100
    `,
    [visitorDatabaseId],
  );

  return {
    visitor,
    sessions: sessionsResult.rows,
    pageViews: pageViewsResult.rows,
    events: eventsResult.rows,
  };
};
