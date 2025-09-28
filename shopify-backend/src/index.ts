import express from "express";
import authRoutes from "./routes/auth.routes";
import vendorRoutes from "./routes/vendor.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import config from "./config";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://shopify-peach-seven.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/product", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`server is running on ${config.PORT}`);
});
