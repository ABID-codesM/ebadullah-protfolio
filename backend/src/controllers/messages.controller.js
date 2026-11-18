import pool from "../config/db.js";

const allowedStatuses = ["new", "read", "replied", "archived"];
const allowedEmailStatuses = ["unknown", "pending", "sent", "failed"];

const getMessageId = (value) => {
  if (!/^\d+$/.test(value || "")) return null;
  return value;
};

const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

// GET: List messages with search, filters and pagination
export const getMessages = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);

    const {
      search,
      folder = "all",
      status,
      projectType,
      emailStatus,
      dateFrom,
      dateTo,
    } = req.query;

    const conditions = [];
    const values = [];

    const addCondition = (sql, value) => {
      values.push(value);
      conditions.push(sql.replace("?", `$${values.length}`));
    };

    // Folders
    switch (folder) {
      case "trash":
        conditions.push("deleted_at IS NOT NULL");
        break;

      case "unread":
        conditions.push("deleted_at IS NULL AND is_read = FALSE");
        break;

      case "read":
        conditions.push("deleted_at IS NULL AND is_read = TRUE");
        break;

      case "replied":
        conditions.push("deleted_at IS NULL AND status = 'replied'");
        break;

      case "archived":
        conditions.push("deleted_at IS NULL AND status = 'archived'");
        break;

      case "inbox":
        conditions.push("deleted_at IS NULL AND status <> 'archived'");
        break;

      case "all":
        conditions.push("deleted_at IS NULL");
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid message folder.",
        });
    }

    // Search
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;

      values.push(term);
      const p = values.length;

      conditions.push(`
        (
          full_name ILIKE $${p}
          OR email ILIKE $${p}
          OR subject ILIKE $${p}
          OR message ILIKE $${p}
        )
      `);
    }

    // Status filter
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid message status.",
        });
      }

      addCondition("status = ?", status);
    }

    // Project type filter
    if (projectType) {
      addCondition("project_type = ?", projectType);
    }

    // Email status filter
    if (emailStatus) {
      if (!allowedEmailStatuses.includes(emailStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email status.",
        });
      }

      addCondition("email_status = ?", emailStatus);
    }

    // Date filters
    if (dateFrom) {
      addCondition("created_at >= ?::date", dateFrom);
    }

    if (dateTo) {
      addCondition("created_at < (?::date + INTERVAL '1 day')", dateTo);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM contact_messages
      ${whereClause}
    `;

    const dataQuery = `
      SELECT
        id,
        full_name,
        email,
        subject,
        project_type,
        status,
        is_read,
        email_status,
        email_attempts,
        created_at,
        deleted_at
      FROM contact_messages
      ${whereClause}
      ORDER BY created_at DESC, id DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const [countResult, messagesResult] = await Promise.all([
      pool.query(countQuery, values),
      pool.query(dataQuery, [...values, limit, offset]),
    ]);

    const total = Number(countResult.rows[0].total);

    return res.status(200).json({
      success: true,
      data: {
        messages: messagesResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET: Single message details
export const getMessageById = async (req, res, next) => {
  try {
    const id = getMessageId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const result = await pool.query(
      `
        SELECT *
        FROM contact_messages
        WHERE id = $1 AND deleted_at IS NULL
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// PATCH: Mark as read or unread
export const updateMessageReadStatus = async (req, res, next) => {
  try {
    const id = getMessageId(req.params.id);
    const { isRead } = req.body;

    if (!id || typeof isRead !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "A valid ID and boolean isRead value are required.",
      });
    }

    const result = await pool.query(
      `
        UPDATE contact_messages
        SET
          is_read = $2,
          status = CASE
            WHEN status = 'archived' OR status = 'replied'
              THEN status
            WHEN $2 = TRUE
              THEN 'read'
            ELSE 'new'
          END
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, status, is_read
      `,
      [id, isRead],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message read status updated.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// PATCH: Update message status
export const updateMessageStatus = async (req, res, next) => {
  try {
    const id = getMessageId(req.params.id);
    const { status } = req.body;

    if (!id || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID or status.",
      });
    }

    const result = await pool.query(
      `
        UPDATE contact_messages
        SET
          status = $2,
          is_read = CASE
            WHEN $2 = 'new' THEN FALSE
            ELSE TRUE
          END
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, status, is_read
      `,
      [id, status],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message status updated.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// PATCH: Archive message
export const archiveMessage = async (req, res, next) => {
  try {
    const id = getMessageId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const result = await pool.query(
      `
        UPDATE contact_messages
        SET status = 'archived'
        WHERE id = $1
          AND deleted_at IS NULL
          AND status <> 'archived'
        RETURNING id, status, is_read
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found or already archived.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message archived successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// PATCH: Restore archived message
export const restoreArchivedMessage = async (req, res, next) => {
  try {
    const id = getMessageId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const result = await pool.query(
      `
        UPDATE contact_messages
        SET status = CASE
          WHEN is_read = TRUE THEN 'read'
          ELSE 'new'
        END
        WHERE id = $1
          AND deleted_at IS NULL
          AND status = 'archived'
        RETURNING id, status, is_read
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Archived message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message restored successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: Move message to Trash
export const moveMessageToTrash = async (req, res, next) => {
  try {
    const id = getMessageId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const result = await pool.query(
      `
        UPDATE contact_messages
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, deleted_at
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message moved to Trash.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// PATCH: Restore message from Trash
export const restoreTrashedMessage = async (req, res, next) => {
  try {
    const id = getMessageId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const result = await pool.query(
      `
        UPDATE contact_messages
        SET deleted_at = NULL
        WHERE id = $1 AND deleted_at IS NOT NULL
        RETURNING id, status, is_read, deleted_at
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Trashed message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message restored from Trash.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: Permanently delete a message from Trash
export const permanentlyDeleteMessage = async (req, res, next) => {
  try {
    const id = getMessageId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const pendingReplies = await pool.query(
      `
    SELECT EXISTS (
      SELECT 1
      FROM contact_replies
      WHERE contact_message_id = $1
        AND email_status = 'pending'
    ) AS has_pending_replies;
  `,
      [messageId],
    );

    if (pendingReplies.rows[0].has_pending_replies) {
      return res.status(409).json({
        success: false,
        message:
          "This message has pending reply emails. Please wait until delivery is completed.",
      });
    }

    const result = await pool.query(
      `
        DELETE FROM contact_messages
        WHERE id = $1
          AND deleted_at IS NOT NULL
          AND email_status IS DISTINCT FROM 'pending'
        RETURNING id
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(409).json({
        success: false,
        message: "Message not found in Trash or email retry is still pending.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message permanently deleted.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
// PATCH: Perform bulk actions on selected messages
export const bulkUpdateMessages = async (req, res, next) => {
  try {
    const { ids, action } = req.body;

    const allowedActions = [
      "mark_read",
      "mark_unread",
      "archive",
      "restore_archive",
      "trash",
      "restore_trash",
    ];

    // Validate IDs
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Select between 1 and 500 messages.",
      });
    }

    // Validate unique positive integer IDs
    const uniqueIds = [...new Set(ids)];

    const validIds = uniqueIds.every(
      (id) =>
        (typeof id === "number" || typeof id === "string") &&
        /^\d+$/.test(String(id)) &&
        BigInt(id) > 0n,
    );

    if (!validIds) {
      return res.status(400).json({
        success: false,
        message: "Invalid message IDs.",
      });
    }

    if (!allowedActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bulk action.",
      });
    }

    // Each action has a predefined, safe SQL statement.
    const actions = {
      mark_read: {
        sql: `
      UPDATE contact_messages
      SET
        is_read = TRUE,
        status = CASE
          WHEN status IN ('archived', 'replied') THEN status
          ELSE 'read'
        END
      WHERE id = ANY($1::bigint[])
        AND deleted_at IS NULL
    `,
      },

      mark_unread: {
        sql: `
      UPDATE contact_messages
      SET
        is_read = FALSE,
        status = CASE
          WHEN status IN ('archived', 'replied') THEN status
          ELSE 'new'
        END
      WHERE id = ANY($1::bigint[])
        AND deleted_at IS NULL
    `,
      },

      archive: {
        sql: `
      UPDATE contact_messages
      SET status = 'archived'
      WHERE id = ANY($1::bigint[])
        AND deleted_at IS NULL
    `,
      },

      restore_archive: {
        sql: `
      UPDATE contact_messages
      SET status = CASE
        WHEN is_read = TRUE THEN 'read'
        ELSE 'new'
      END
      WHERE id = ANY($1::bigint[])
        AND deleted_at IS NULL
        AND status = 'archived'
    `,
      },

      trash: {
        sql: `
      UPDATE contact_messages
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ANY($1::bigint[])
        AND deleted_at IS NULL
    `,
      },

      restore_trash: {
        sql: `
      UPDATE contact_messages
      SET deleted_at = NULL
      WHERE id = ANY($1::bigint[])
        AND deleted_at IS NOT NULL
    `,
      },
    };

    const result = await pool.query(actions[action].sql, [uniqueIds]);

    return res.status(200).json({
      success: true,
      message: "Bulk action completed successfully.",
      data: {
        action,
        requestedCount: uniqueIds.length,
        affectedCount: result.rowCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
