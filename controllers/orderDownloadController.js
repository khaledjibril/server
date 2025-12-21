import pool from "../config/db.js";
import path from "path";
import fs from "fs";

export const downloadOrderImage = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT image_path
      FROM orders
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const imagePath = path.join(process.cwd(), rows[0].image_path);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.download(imagePath);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
};
