"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const config_1 = __importDefault(require("../config"));
function errorHandler(err, _req, res, _next) {
    var _a, _b;
    const status = (_a = err === null || err === void 0 ? void 0 : err.statusCode) !== null && _a !== void 0 ? _a : 500;
    const body = { error: (_b = err === null || err === void 0 ? void 0 : err.message) !== null && _b !== void 0 ? _b : "Internal Server Error" };
    if (config_1.default.NODE_ENV !== "production" && (err === null || err === void 0 ? void 0 : err.stack))
        body.stack = err.stack;
    console.error(err);
    res.status(status).json(body);
}
