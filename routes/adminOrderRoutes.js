import express from "express";
import { getAllOrders } from "../controllers/adminOrderController.js";

const router = express.Router();

router.get("/orders", getAllOrders);

export default router;
