"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    PORT: Number(process.env.PORT || 4000),
    JWT_SECRET: process.env.JWT_SECRET || "changeme",
    JWT_EXPIRY: process.env.JWT_EXPIRY || "1d",
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
    PLATFORM_FEE_PERCENT: Number((_a = process.env.PLATFORM_FEE_PERCENT) !== null && _a !== void 0 ? _a : 20),
    NODE_ENV: process.env.NODE_ENV || "development",
};
