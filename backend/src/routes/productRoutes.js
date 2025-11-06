import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  deleteAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.delete("/", deleteAllProducts);
router.delete("/:id", deleteProduct);
router.patch("/:id", updateProduct);

export default router;
