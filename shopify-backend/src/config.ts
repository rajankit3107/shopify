import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: Number(process.env.PORT || 4000),
  JWT_SECRET: process.env.JWT_SECRET || "changeme",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  PLATFORM_FEE_PERCENT: Number(process.env.PLATFORM_FEE_PERCENT ?? 20),
  NODE_ENV: process.env.NODE_ENV || "development",
};
