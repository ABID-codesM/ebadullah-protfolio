import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "portfolio_admin_token";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
});

const createToken = (admin) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
};

// ADMIN LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, is_active
       FROM admins
       WHERE LOWER(email) = $1
       LIMIT 1`,
      [normalizedEmail],
    );

    const admin = result.rows[0];

    if (
      !admin ||
      !admin.is_active ||
      !(await bcrypt.compare(password, admin.password_hash))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = createToken(admin);

    await pool.query(
      `UPDATE admins
       SET last_login_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [admin.id],
    );

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      admin: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET CURRENT ADMIN
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

// ADMIN LOGOUT
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
