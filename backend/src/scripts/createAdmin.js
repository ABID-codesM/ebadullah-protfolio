import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing.");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must contain at least 12 characters.");
    }

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existing = await pool.query(
      `SELECT id FROM admins WHERE LOWER(email) = $1`,
      [email],
    );

    if (existing.rowCount > 0) {
      throw new Error("An admin with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await pool.query(
      `INSERT INTO admins (full_name, email, password_hash)
       VALUES ($1, $2, $3)`,
      [ADMIN_NAME.trim(), email, passwordHash],
    );

    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

createAdmin();
