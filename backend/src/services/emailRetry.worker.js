import pool from "../config/db.js";
import { sendContactNotification } from "./contactEmail.service.js";

const RETRY_DELAYS = [
  1, // First retry: 1 minute
  5, // Second retry: 5 minutes
  15, // Third retry: 15 minutes
  60, // Fourth retry: 60 minutes
];

const MAX_ATTEMPTS = 5;
const POLLING_INTERVAL = 15000;

let intervalId = null;
let isProcessing = false;
let isStopping = false;
let processingPromise = Promise.resolve();

// Atomically claim one pending email
const claimPendingEmail = async () => {
  const query = `
    WITH candidate AS (
      SELECT id
      FROM contact_messages
      WHERE email_status = 'pending'
        AND email_next_attempt_at <= CURRENT_TIMESTAMP
      ORDER BY email_next_attempt_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )

    UPDATE contact_messages AS contact
    SET
      email_attempts = contact.email_attempts + 1,
      email_next_attempt_at =
        CURRENT_TIMESTAMP + INTERVAL '10 minutes'

    FROM candidate

    WHERE contact.id = candidate.id

    RETURNING
      contact.id,
      contact.full_name,
      contact.email,
      contact.subject,
      contact.project_type,
      contact.message,
      contact.email_attempts;
  `;

  const result = await pool.query(query);

  return result.rows[0] || null;
};

// Process one email
const processEmail = async (contact) => {
  const {
    id,
    full_name,
    email,
    subject,
    project_type,
    message,
    email_attempts,
  } = contact;

  try {
    await sendContactNotification({
      fullName: full_name,
      email,
      subject,
      projectType: project_type,
      message,
    });

    await pool.query(
      `
        UPDATE contact_messages
        SET
          email_status = 'sent',
          email_sent_at = CURRENT_TIMESTAMP,
          email_last_error = NULL,
          email_next_attempt_at = NULL
        WHERE id = $1;
      `,
      [id],
    );

    console.log(`Contact email sent successfully. Message ID: ${id}`);
  } catch (error) {
    console.error(
      `Email attempt ${email_attempts} failed for message ${id}:`,
      error.message,
    );

    const lastError = String(error.message).slice(0, 1000);

    if (email_attempts >= MAX_ATTEMPTS) {
      await pool.query(
        `
          UPDATE contact_messages
          SET
            email_status = 'failed',
            email_last_error = $2,
            email_next_attempt_at = NULL
          WHERE id = $1;
        `,
        [id, lastError],
      );

      console.error(
        `Email permanently failed after ${MAX_ATTEMPTS} attempts. Message ID: ${id}`,
      );

      return;
    }

    const delayMinutes = RETRY_DELAYS[email_attempts - 1];

    await pool.query(
      `
        UPDATE contact_messages
        SET
          email_status = 'pending',
          email_last_error = $2,
          email_next_attempt_at =
            CURRENT_TIMESTAMP + ($3 * INTERVAL '1 minute')
        WHERE id = $1;
      `,
      [id, lastError, delayMinutes],
    );

    console.log(
      `Message ${id} scheduled for retry in ${delayMinutes} minutes.`,
    );
  }
};

// Process all currently due emails
const processPendingEmails = async () => {
  while (!isStopping) {
    const contact = await claimPendingEmail();

    if (!contact) {
      break;
    }

    await processEmail(contact);
  }
};

// Prevent overlapping worker executions
const triggerWorker = () => {
  if (isProcessing || isStopping) {
    return;
  }

  isProcessing = true;

  processingPromise = processPendingEmails()
    .catch((error) => {
      console.error("Email Retry Worker Error:", error);
    })
    .finally(() => {
      isProcessing = false;
    });
};

// Start worker
export const startEmailRetryWorker = () => {
  if (intervalId) {
    return;
  }

  isStopping = false;

  console.log("Email Retry Worker started.");

  triggerWorker();

  intervalId = setInterval(triggerWorker, POLLING_INTERVAL);
};

// Stop worker gracefully
export const stopEmailRetryWorker = async () => {
  isStopping = true;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  await processingPromise;

  console.log("Email Retry Worker stopped.");
};
