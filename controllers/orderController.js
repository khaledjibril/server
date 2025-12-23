import pool from "../config/db.js";
import { calculateTotalPrice } from "../utils/priceCalculator.js";

export const createOrder = async (req, res) => {
  try {
    const { size, frame, frameType, address } = req.body;
    const imageFile = req.file;

    if (!imageFile || !size || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔐 Backend price calculation
    const totalPrice = calculateTotalPrice({
      size,
      frame,
      frameType
    });

    const imagePath = `/uploads/${imageFile.filename}`;

    const query = `
      INSERT INTO orders
      (full_name, email, size, frame, frame_type, address, total_price, image_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      req.body.full_name,
      req.body.email,
      size,
      frame,
      frame === "yes" ? frameType : null,
      address,
      totalPrice,
      imagePath
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: "Order created",
      order: rows[0]
    });

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};export const getUserOrders = async (req, res) => {
  const userId = req.user.id; // safe to use

  try {
    const result = await pool.query(
      `SELECT id, size, frame, frame_type, address, total_price, image_path, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
