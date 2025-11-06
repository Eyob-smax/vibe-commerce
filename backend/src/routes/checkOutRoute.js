import express from "express";
import { checkout } from "../controllers/checkOutController.js";

const router = express.Router();

router.post("/", checkout);

export default router;
