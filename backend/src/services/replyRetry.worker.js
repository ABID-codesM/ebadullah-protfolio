import pool from "../config/db.js";
import { sendReplyEmail } from "./replyEmail.service.js";

const POLL_INTERVAL = 15000;
const MAX_ATTEMPTS = 5;
const RETRY_DELAYS = [1, 5, 15, 60];
const EMAIL_LEASE_MINUTES = 10;
const BATCH_SIZE = 5;

let workerTimer = null;
let isRunning = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const claimPendingReplies = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        WITH pending_replies AS (
          SELECT id
          FROM contact_replies
          WHERE email_status = 'pending'
            AND email_attempts < $1
            AND (
              email_next_attempt_at IS NULL
              OR email_next_attempt_at <= CURRENT_TIMESTAMP
            )
          ORDER BY created_at ASC
          LIMIT $2
          FOR UPDATE SKIP LOCKED
        )

        UPDATE contact_replies AS replies

        SET
          email_attempts = replies.email_attempts + 1,
          email_next_attempt_at =
            CURRENT_TIMESTAMP + ($3 * INTERVAL '1 minute')

        FROM pending_replies

        WHERE replies.id = pending_replies.id

        RETURNING replies.*;
      `,
      [MAX_ATTEMPTS, BATCH_SIZE, EMAIL_LEASE_MINUTES],
    );

    await client.query("COMMIT");

    return result.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const markReplyAsSent = async (reply) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        UPDATE contact_replies

        SET
          email_status = 'sent',
          email_sent_at = CURRENT_TIMESTAMP,
          email_last_error = NULL,
          email_next_attempt_at = NULL

        WHERE id = $1
          AND email_status = 'pending';
      `,
      [reply.id],
    );

    await client.query(
      `
        UPDATE contact_messages

        SET
          status = 'replied',
          is_read = TRUE

        WHERE id = $1;
      `,
      [reply.contact_message_id],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const markReplyAsFailedOrRetry = async (reply, error) => {
  const attempts = Number(reply.email_attempts);

  const errorMessage = String(
    error?.message || "Unknown email delivery error.",
  ).slice(0, 2000);

  const isFinalAttempt = attempts >= MAX_ATTEMPTS;

  if (isFinalAttempt) {
    await pool.query(
      `
        UPDATE contact_replies

        SET
          email_status = 'failed',
          email_last_error = $2,
          email_next_attempt_at = NULL

        WHERE id = $1
          AND email_status = 'pending';
      `,
      [reply.id, errorMessage],
    );

    return;
  }

  const delayMinutes = RETRY_DELAYS[attempts - 1] ?? 60;

  await pool.query(
    `
      UPDATE contact_replies

      SET
        email_status = 'pending',
        email_last_error = $2,
        email_next_attempt_at =
          CURRENT_TIMESTAMP + ($3 * INTERVAL '1 minute')

      WHERE id = $1
        AND email_status = 'pending';
    `,
    [reply.id, errorMessage, delayMinutes],
  );
};

const processReply = async (reply) => {
  try {
    await sendReplyEmail(reply);

    await markReplyAsSent(reply);

    console.log(`Reply email sent successfully. Reply ID: ${reply.id}`);
  } catch (error) {
    console.error(`Reply email failed. Reply ID: ${reply.id}`, error.message);

    try {
      await markReplyAsFailedOrRetry(reply, error);
    } catch (databaseError) {
      console.error(
        `Could not update reply retry status. Reply ID: ${reply.id}`,
        databaseError,
      );
    }
  }
};

const processPendingReplies = async () => {
  if (isRunning) return;

  isRunning = true;

  try {
    const replies = await claimPendingReplies();

    for (const reply of replies) {
      await processReply(reply);
    }
  } catch (error) {
    console.error("Reply Retry Worker error:", error);
  } finally {
    isRunning = false;
  }
};

export const startReplyRetryWorker = () => {
  if (workerTimer) return;

  console.log("Reply Retry Worker started.");

  processPendingReplies();

  workerTimer = setInterval(processPendingReplies, POLL_INTERVAL);
};

export const stopReplyRetryWorker = async () => {
  if (workerTimer) {
    clearInterval(workerTimer);
    workerTimer = null;
  }

  while (isRunning) {
    await sleep(100);
  }

  console.log("Reply Retry Worker stopped.");
};
