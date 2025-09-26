import { Router } from "express";
import { requireAuth } from "../middlewares/authmiddleware";
import {
  createorder,
  markPaid,
  myOrders,
  vendorOrders,
} from "../controllers/orders.controller";

const router = Router();

router.post("/", requireAuth, createorder);
router.post("/paid", markPaid);
router.get("/me", requireAuth, myOrders);
router.get("/vendor/me", requireAuth, vendorOrders);

export default router;
