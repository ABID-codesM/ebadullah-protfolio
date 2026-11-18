import pool from "../config/db.js";

export const getDashboardOverview = async (req, res, next) => {
  try {
    const [statsResult, recentMessagesResult] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) AS total_messages,

          COUNT(*) FILTER (
            WHERE status = 'new'
          ) AS new_messages,

          COUNT(*) FILTER (
            WHERE is_read = FALSE
          ) AS unread_messages,

          COUNT(*) FILTER (
            WHERE email_status = 'sent'
          ) AS sent_emails,

          COUNT(*) FILTER (
            WHERE email_status = 'pending'
          ) AS pending_emails,

          COUNT(*) FILTER (
            WHERE email_status = 'failed'
          ) AS failed_emails

        FROM contact_messages
      `),

      pool.query(`
        SELECT
          id,
          full_name,
          subject,
          project_type,
          status,
          is_read,
          email_status,
          created_at

        FROM contact_messages

        ORDER BY created_at DESC

        LIMIT 5
      `),
    ]);

    const stats = statsResult.rows[0];

    return res.status(200).json({
      success: true,

      data: {
        stats: {
          totalMessages: Number(stats.total_messages),
          newMessages: Number(stats.new_messages),
          unreadMessages: Number(stats.unread_messages),

          sentEmails: Number(stats.sent_emails),
          pendingEmails: Number(stats.pending_emails),
          failedEmails: Number(stats.failed_emails),
        },

        recentMessages: recentMessagesResult.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
