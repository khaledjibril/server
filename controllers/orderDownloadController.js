import pool from "../config/db.js";
import fetch from "node-fetch"; // Only if you want to stream the file

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

    const imageUrl = rows[0].image_path;

    if (!imageUrl) {
      return res.status(404).json({ message: "Image URL not found" });
    }

    // Option 1: Redirect the client directly to Cloudinary
    return res.redirect(imageUrl);

    // ---------- OR ----------
    // Option 2: Stream the image through your server
    // const response = await fetch(imageUrl);
    // if (!response.ok) throw new Error("Failed to fetch image");
    // res.setHeader("Content-Disposition", `attachment; filename=order-${id}.jpg`);
    // response.body.pipe(res);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
};
