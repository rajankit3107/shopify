import { Router } from "express";
import { callback, webhook } from "../controllers/payment.controller";

const router = Router();

router.post("/callback", callback);
router.post("/webhook", webhook);

export default router;
