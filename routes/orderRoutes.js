import express from "express";
import upload from "../middlewares/upload.js";
import { createOrder, getUserOrders } from "../controllers/orderController.js";
import { downloadOrderImage } from "../controllers/orderDownloadController.js";

import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* CREATE ORDER */
router.post("/", upload.single("image"), createOrder);
router.get("/user", verifyToken, getUserOrders);

/* DOWNLOAD ORDER IMAGE */
router.get("/:id/download", downloadOrderImage);

export default router;


