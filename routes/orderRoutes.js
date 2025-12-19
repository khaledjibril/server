import express from "express";
import upload from "../middlewares/upload.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", upload.single("image"), createOrder);

export default router;
