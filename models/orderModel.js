import pool from "../config/db.js";

export const getRecentOrders = async (limit = 5) => {
  const res = await pool.query(
    "SELECT full_name FROM bookings ORDER BY created_at DESC LIMIT $1",
    [limit]
  );
  return res.rows;
};

export const getTotalOrders = async () => {
  const res = await pool.query("SELECT COUNT(*) FROM bookings");
  return parseInt(res.rows[0].count);
};
