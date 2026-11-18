import pool from "../config/db.js";
import { validateContact } from "../validators/contact.validator.js";

export const submitContact = async (req, res, next) => {
  try {
    const { isValid, errors, sanitizedData } = validateContact(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Please check your submitted information.",
        errors,
      });
    }

    const { fullName, email, subject, projectType, message } = sanitizedData;

    // Save message and queue email notification
    const query = `
      INSERT INTO contact_messages (
        full_name,
        email,
        subject,
        project_type,
        message,
        email_status,
        email_attempts,
        email_next_attempt_at
      )
      VALUES ($1, $2, $3, $4, $5, 'pending', 0, CURRENT_TIMESTAMP)
      RETURNING id, status, created_at, email_status;
    `;

    const values = [fullName, email, subject, projectType, message];

    const result = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: "Your message has been received successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
