// controllers/orderController.js
import pool from "../config/db.js";

export const createOrder = async (req, res) => {
  try {
    const { size, frame, frameType, address } = req.body;
    const file = req.file;

    if (!file || !size || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Price calculation logic
    let basePrice = 0;
    switch (size) {
      case "5x7": basePrice = 4500; break;
      case "8x10": basePrice = 8000; break;
      case "10x12": basePrice = 10500; break;
      case "12x15": basePrice = 15500; break;
      case "16x20": basePrice = 20000; break;
      case "16x24": basePrice = 26200; break;
      case "20x24": basePrice = 35100; break;
      case "20x30": basePrice = 55200; break;
      case "24x30": basePrice = 70200; break;
      case "24x35": basePrice = 86500; break;
      case "30x35": basePrice = 120000; break;
      case "35x40": basePrice = 155000; break;
      default: basePrice = 0;
    }

    const framePrice = frame === "yes" ? 5000 : 0; // Example extra for frame
    const totalPrice = basePrice + framePrice;

    // Get user from JWT if needed (optional)
    const userId = req.user?.id || null;

    const result = await pool.query(
      `INSERT INTO orders 
        (user_id, image_path, size, frame, frame_type, address, total_price)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [userId, file.filename, size, frame, frameType, address, totalPrice]
    );

    return res.status(201).json({
      message: "Order created successfully",
      order: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
