import { Router } from "express";
import {
  createVendor,
  getVendor,
  listVendors,
  getVendorMe,
} from "../controllers/vendor.controller";
import { requireAuth } from "../middlewares/authmiddleware";

const router = Router();

router.post("/", requireAuth, createVendor);
router.get("/me", requireAuth, getVendorMe);
router.get("/:slug", getVendor);
router.get("/", listVendors);

export default router;
