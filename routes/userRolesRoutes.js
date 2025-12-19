import express from "express";
import { getUsers, updateAdminRole } from "../controllers/userRolesController.js";

const router = express.Router();

router.get("/", getUsers);
router.patch("/:userId/role", updateAdminRole);

export default router;
