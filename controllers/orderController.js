import pool from "../config/db.js";
import { calculateTotalPrice } from "../utils/priceCalculator.js";

/**
 * CREATE ORDER
 * Cloudinary-based (imageUrl only)
 */
export const createOrder = async (req, res) => {
  try {
    const {
      full_name,
      email,
      size,
      frame,
      frameType,
      address,
      imageUrl,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (!imageUrl || !size || !address) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // =========================
    // PRICE CALCULATION (SERVER)
    // =========================
    const totalPrice = calculateTotalPrice({
      size,
      frame,
      frameType,
    });

    // =========================
    // INSERT ORDER
    // =========================
    const query = `
      INSERT INTO orders
      (
        full_name,
        email,
        size,
        frame,
        frame_type,
        address,
        total_price,
        image_path
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;

    const values = [
      full_name || null,
      email || null,
      size,
      frame || "no",
      frame === "yes" ? frameType : null,
      address,
      totalPrice,
      imageUrl, // Cloudinary URL
    ];

    const { rows } = await pool.query(query, values);

    return res.status(201).json({
      message: "Order created successfully",
      order: rows[0],
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * GET USER ORDERS
 * Returns Cloudinary URLs directly
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT
        id,
        full_name,
        email,
        size,
        frame,
        frame_type,
        address,
        total_price,
        image_path AS "imageUrl",
        created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;

    const { rows } = await pool.query(query, [userId]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
