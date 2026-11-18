import pool from "../config/db.js";

const MAX_LIMIT = 100;

const getPagination = (query) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);

  const requestedLimit = Number.parseInt(query.limit, 10) || 20;

  const limit = Math.min(MAX_LIMIT, Math.max(1, requestedLimit));

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

// GET /api/emails/stats
export const getEmailStats = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total_emails,

        COUNT(*) FILTER (
          WHERE email_status = 'sent'
        )::int AS sent_emails,

        COUNT(*) FILTER (
          WHERE email_status = 'pending'
        )::int AS pending_emails,

        COUNT(*) FILTER (
          WHERE email_status = 'failed'
        )::int AS failed_emails,

        COUNT(*) FILTER (
          WHERE email_status = 'unknown'
             OR email_status IS NULL
        )::int AS unknown_emails

      FROM (
        SELECT email_status
        FROM contact_messages

        UNION ALL

        SELECT email_status
        FROM contact_replies
      ) AS all_emails;
    `);

    const resultByType = await pool.query(`
      SELECT
        COUNT(*) FILTER (
          WHERE email_type = 'contact_notification'
        )::int AS contact_notifications,

        COUNT(*) FILTER (
          WHERE email_type = 'admin_reply'
        )::int AS admin_replies

      FROM (
        SELECT 'contact_notification' AS email_type
        FROM contact_messages

        UNION ALL

        SELECT 'admin_reply' AS email_type
        FROM contact_replies
      ) AS all_emails;
    `);

    return res.status(200).json({
      success: true,
      data: {
        ...result.rows[0],
        ...resultByType.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/emails
export const getEmails = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);

    const { search, status, type, dateFrom, dateTo } = req.query;

    const validStatuses = ["pending", "sent", "failed", "unknown"];

    const validTypes = ["contact_notification", "admin_reply"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email status.",
      });
    }

    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email type.",
      });
    }

    if (dateFrom && Number.isNaN(Date.parse(dateFrom))) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date.",
      });
    }

    if (dateTo && Number.isNaN(Date.parse(dateTo))) {
      return res.status(400).json({
        success: false,
        message: "Invalid end date.",
      });
    }

    if (dateFrom && dateTo && dateFrom > dateTo) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date.",
      });
    }

    const values = [];
    const conditions = [];

    const addValue = (value) => {
      values.push(value);
      return `$${values.length}`;
    };

    if (search) {
      const searchParam = addValue(`%${String(search).trim().slice(0, 200)}%`);

      conditions.push(`
        (
          visitor_name ILIKE ${searchParam}
          OR visitor_email ILIKE ${searchParam}
          OR recipient_email ILIKE ${searchParam}
          OR subject ILIKE ${searchParam}
        )
      `);
    }

    if (status) {
      const statusParam = addValue(status);

      conditions.push(`
        email_status = ${statusParam}
      `);
    }

    if (type) {
      const typeParam = addValue(type);

      conditions.push(`
        email_type = ${typeParam}
      `);
    }

    if (dateFrom) {
      const fromParam = addValue(dateFrom);

      conditions.push(`
        created_at >= ${fromParam}::date
      `);
    }

    if (dateTo) {
      const toParam = addValue(dateTo);

      conditions.push(`
        created_at < (${toParam}::date + INTERVAL '1 day')
      `);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const baseQuery = `
      WITH all_emails AS (

        SELECT
          cm.id,
          'contact_notification'::text AS email_type,

          cm.full_name AS visitor_name,
          cm.email AS visitor_email,

          $1::varchar AS recipient_email,

          cm.subject,

          COALESCE(cm.email_status, 'unknown')
            AS email_status,

          cm.email_attempts,
          cm.email_last_error,
          cm.email_next_attempt_at,
          cm.email_sent_at,

          cm.created_at,

          NULL::bigint AS admin_id,
          NULL::varchar AS admin_name

        FROM contact_messages cm

        UNION ALL

        SELECT
          cr.id,
          'admin_reply'::text AS email_type,

          cm.full_name AS visitor_name,
          cm.email AS visitor_email,

          cr.recipient_email,

          cr.subject,

          cr.email_status,

          cr.email_attempts,
          cr.email_last_error,
          cr.email_next_attempt_at,
          cr.email_sent_at,

          cr.created_at,

          cr.admin_id,
          a.full_name AS admin_name

        FROM contact_replies cr

        INNER JOIN contact_messages cm
          ON cm.id = cr.contact_message_id

        LEFT JOIN admins a
          ON a.id = cr.admin_id
      )
    `;

    const receiverEmail = process.env.CONTACT_RECEIVER || "";

    const countValues = [receiverEmail, ...values];

    const countResult = await pool.query(
      `
        ${baseQuery}

        SELECT COUNT(*)::int AS total

        FROM all_emails

        ${whereClause};
      `,
      countValues,
    );

    const total = countResult.rows[0].total;

    const limitParam = values.length + 2;
    const offsetParam = values.length + 3;

    const result = await pool.query(
      `
        ${baseQuery}

        SELECT *

        FROM all_emails

        ${whereClause}

        ORDER BY created_at DESC, id DESC

        LIMIT $${limitParam}
        OFFSET $${offsetParam};
      `,
      [receiverEmail, ...values, limit, offset],
    );

    return res.status(200).json({
      success: true,
      data: {
        emails: result.rows,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/emails/contact/:id/retry
export const retryContactEmail = async (req, res, next) => {
  try {
    const messageId = Number(req.params.id);

    if (!Number.isSafeInteger(messageId) || messageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const result = await pool.query(
      `
        UPDATE contact_messages

        SET
          email_status = 'pending',
          email_attempts = 0,
          email_last_error = NULL,
          email_next_attempt_at = CURRENT_TIMESTAMP,
          email_sent_at = NULL

        WHERE id = $1
          AND email_status = 'failed'

        RETURNING id, email_status, email_attempts;
      `,
      [messageId],
    );

    if (result.rowCount === 0) {
      return res.status(409).json({
        success: false,
        message: "Email not found or is not in failed status.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact notification queued for retry.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/emails/replies/:id/retry
export const retryReplyEmail = async (req, res, next) => {
  try {
    const replyId = Number(req.params.id);

    if (!Number.isSafeInteger(replyId) || replyId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid reply ID.",
      });
    }

    const result = await pool.query(
      `
        UPDATE contact_replies

        SET
          email_status = 'pending',
          email_attempts = 0,
          email_last_error = NULL,
          email_next_attempt_at = CURRENT_TIMESTAMP,
          email_sent_at = NULL

        WHERE id = $1
          AND email_status = 'failed'

        RETURNING id, email_status, email_attempts;
      `,
      [replyId],
    );

    if (result.rowCount === 0) {
      return res.status(409).json({
        success: false,
        message: "Reply not found or is not in failed status.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reply email queued for retry.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
