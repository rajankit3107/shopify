"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = require("../utils/apiError");
const config_1 = __importDefault(require("../config"));
function requireAuth(req, res, next) {
    var _a, _b;
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
        return next(apiError_1.ApiError.unauthorized(`Unauthorized`));
    const token = header.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        req.user = {
            id: (_a = payload.sub) !== null && _a !== void 0 ? _a : payload.id,
            role: (_b = payload.role) !== null && _b !== void 0 ? _b : payload.role,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: `Invalid token` });
    }
}
