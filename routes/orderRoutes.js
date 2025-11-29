// routes/orderRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { createOrder } from "../controllers/orderController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// POST /api/orders
router.post("/", verifyToken, upload.single("image"), createOrder);

export default router;
