import express from "express";
import authRoutes from "./routes/auth.routes";
import config from "./config";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(config.PORT, () => {
  console.log(`server is running on ${config.PORT}`);
});
