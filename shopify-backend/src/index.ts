import express from "express";
import authRoutes from "./routes/auth.routes";
import vendorRoutes from "./routes/vendor.routes";
import config from "./config";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`server is running on ${config.PORT}`);
});
