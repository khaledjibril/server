import pool from "../config/db.js";

import { calculatePrice } from "../utils/priceCalculator.js";

export const createOrder = async (req, res) => {
  try {
    const { size, frame, frameType, address } = req.body;

    if (!req.file || !size || !frame || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const totalPrice = calculatePrice(size, frame);

    const result = await pool.query(
      `
      INSERT INTO orders (image_url, size, frame, frame_type, address, total_price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [imageUrl, size, frame, frameType || null, address, totalPrice]
    );

    res.status(201).json({
      message: "Order created successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
