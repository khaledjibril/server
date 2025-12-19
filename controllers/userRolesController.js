import pool from "../config/db.js";

/**
 * GET all users
 */
export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, full_name, email, is_admin FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE admin role
 */
export const updateAdminRole = async (req, res) => {
  const { userId } = req.params;
  const { is_admin } = req.body;

  try {
    await pool.query(
      "UPDATE users SET is_admin = $1 WHERE id = $2",
      [is_admin, userId]
    );

    res.json({ message: "User role updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
