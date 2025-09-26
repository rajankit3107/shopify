import { Router } from "express";
import {
  createVendor,
  getVendor,
  listVendors,
} from "../controllers/vendor.controller";
import { requireAuth } from "../middlewares/authmiddleware";

const router = Router();

router.post("/", requireAuth, createVendor);
router.get("/:slug", requireAuth, getVendor);
router.get("/", requireAuth, listVendors);

export default router;
