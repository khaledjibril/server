import crypto from "crypto";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

/**
 * POST /api/auth/forgot-password
 * Generates reset code and returns it on-screen
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      `
      UPDATE users
      SET reset_code = $1,
          reset_code_expires = $2
      WHERE email = $3
      `,
      [resetCode, expires, email]
    );

    res.json({
      message: "Reset code generated",
      resetCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/reset-password
 * Resets password using reset code
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await pool.query(
      `
      SELECT id FROM users
      WHERE email = $1
        AND reset_code = $2
        AND reset_code_expires > NOW()
      `,
      [email, resetCode]
    );

    if (user.rowCount === 0) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET password = $1,
          reset_code = NULL,
          reset_code_expires = NULL
      WHERE email = $2
      `,
      [hashedPassword, email]
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// new phase
export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      rows[0].password
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
