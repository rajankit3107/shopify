import Router from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
  getVendorProducts,
} from "../controllers/product.controller";
import { requireAuth } from "../middlewares/authmiddleware";

const router = Router();

router.get("/", listProducts);
router.get("/vendor", requireAuth, getVendorProducts);
router.get("/:id", getProduct);
router.post("/", requireAuth, createProduct);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
