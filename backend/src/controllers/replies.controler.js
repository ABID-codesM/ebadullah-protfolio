import pool from "../config/db.js";

const validateReply = (data) => {
  const errors = {};

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      isValid: false,
      errors: {
        general: "Invalid request data.",
      },
    };
  }

  const subject = typeof data.subject === "string" ? data.subject.trim() : "";

  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (subject.length < 3) {
    errors.subject = "Subject must contain at least 3 characters.";
  } else if (subject.length > 200) {
    errors.subject = "Subject cannot exceed 200 characters.";
  } else if (/[\r\n]/.test(subject)) {
    errors.subject = "Subject contains invalid characters.";
  }

  if (message.length < 2) {
    errors.message = "Reply must contain at least 2 characters.";
  } else if (message.length > 10000) {
    errors.message = "Reply cannot exceed 10000 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      subject,
      message,
    },
  };
};

// GET /api/messages/:id/replies
export const getMessageReplies = async (req, res, next) => {
  try {
    const messageId = Number(req.params.id);

    if (!Number.isSafeInteger(messageId) || messageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const messageResult = await pool.query(
      `
        SELECT id
        FROM contact_messages
        WHERE id = $1
          AND deleted_at IS NULL;
      `,
      [messageId],
    );

    if (messageResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    const result = await pool.query(
      `
        SELECT
          r.id,
          r.contact_message_id,
          r.admin_id,
          a.full_name AS admin_name,
          r.recipient_email,
          r.subject,
          r.message,
          r.email_status,
          r.email_attempts,
          r.email_last_error,
          r.email_next_attempt_at,
          r.email_sent_at,
          r.created_at

        FROM contact_replies r

        LEFT JOIN admins a
          ON a.id = r.admin_id

        WHERE r.contact_message_id = $1

        ORDER BY r.created_at ASC, r.id ASC;
      `,
      [messageId],
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/messages/:id/replies
export const createMessageReply = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const messageId = Number(req.params.id);

    if (!Number.isSafeInteger(messageId) || messageId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const { isValid, errors, sanitizedData } = validateReply(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Please check your reply information.",
        errors,
      });
    }

    const adminId = req.admin?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    await client.query("BEGIN");

    const messageResult = await client.query(
      `
        SELECT id, email, subject

        FROM contact_messages

        WHERE id = $1
          AND deleted_at IS NULL

        FOR UPDATE;
      `,
      [messageId],
    );

    if (messageResult.rowCount === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    const originalMessage = messageResult.rows[0];

    const replyResult = await client.query(
      `
        INSERT INTO contact_replies (
          contact_message_id,
          admin_id,
          recipient_email,
          subject,
          message,
          email_status,
          email_attempts,
          email_next_attempt_at
        )

        VALUES (
          $1, $2, $3, $4, $5,
          'pending', 0, CURRENT_TIMESTAMP
        )

        RETURNING
          id,
          contact_message_id,
          admin_id,
          recipient_email,
          subject,
          message,
          email_status,
          email_attempts,
          created_at;
      `,
      [
        messageId,
        adminId,
        originalMessage.email,
        sanitizedData.subject,
        sanitizedData.message,
      ],
    );

    await client.query(
      `
        UPDATE contact_messages

        SET is_read = TRUE

        WHERE id = $1;
      `,
      [messageId],
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Reply queued successfully for email delivery.",
      data: replyResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};
