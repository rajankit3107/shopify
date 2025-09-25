"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = exports.createProductSchema = exports.createVendorSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string().min(6),
    role: zod_1.default.enum(["CUSTOMER", "VENDOR"]).default("CUSTOMER"),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string().min(1),
});
exports.createVendorSchema = zod_1.default.object({
    name: zod_1.default.string().min(2),
    slug: zod_1.default.string().min(2),
    description: zod_1.default.string().optional(),
    logoUrl: zod_1.default.string().optional(),
});
exports.createProductSchema = zod_1.default.object({
    name: zod_1.default.string().min(2),
    description: zod_1.default.string().optional(),
    price: zod_1.default.number().int().positive(),
    stock: zod_1.default.number().int().nonnegative().default(0),
    imageUrl: zod_1.default.url().optional(),
});
exports.createOrderSchema = zod_1.default.object({
    vendorId: zod_1.default.cuid(),
    items: zod_1.default
        .array(zod_1.default.object({ productId: zod_1.default.cuid(), quantity: zod_1.default.number().int().min(1) }))
        .min(1),
});
