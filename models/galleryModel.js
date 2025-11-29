import pool from "../config/db.js";

export const saveGalleryImage = async (title, description, filePath) => {
  await pool.query(
    "INSERT INTO gallery (title, description, file_path, created_at) VALUES ($1, $2, $3, NOW())",
    [title, description, filePath]
  );
};
