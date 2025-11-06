import express from "express";
import { checkout } from "../controllers/checkOutController.js";

const router = express.Router();

// POST /api/checkout
router.post("/", checkout);

export default router;
