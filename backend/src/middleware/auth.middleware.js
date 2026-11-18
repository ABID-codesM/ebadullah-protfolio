import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "portfolio_admin_token";

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT id, full_name, email
       FROM admins
       WHERE id = $1 AND is_active = TRUE
       LIMIT 1`,
      [decoded.id],
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account is unavailable.",
      });
    }

    req.admin = {
      id: admin.id,
      fullName: admin.full_name,
      email: admin.email,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication.",
      });
    }

    next(error);
  }
};
