import pool from "../config/db.js";

export const getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        full_name,
        email,
        size,
        frame,
        frame_type,
        total_price,
        image_path,
        created_at
      FROM orders
      ORDER BY created_at DESC;
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
