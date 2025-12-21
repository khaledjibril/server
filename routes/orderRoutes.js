import express from "express";
import upload from "../middlewares/upload.js";
import { createOrder } from "../controllers/orderController.js";
import { downloadOrderImage } from "../controllers/orderDownloadController.js";

const router = express.Router();

/* CREATE ORDER */
router.post("/", upload.single("image"), createOrder);

/* DOWNLOAD ORDER IMAGE */
router.get("/:id/download", downloadOrderImage);

export default router;
