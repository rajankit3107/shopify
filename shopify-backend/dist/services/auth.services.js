"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const config_1 = __importDefault(require("../config"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const apiError_1 = require("../utils/apiError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function signup(email, password, role) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = yield prismaClient_1.default.user.findUnique({
            where: { email },
        });
        if (existing)
            throw apiError_1.ApiError.badRequest("username already taken");
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prismaClient_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });
        return user;
    });
}
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prismaClient_1.default.user.findUnique({
            where: { email },
        });
        console.log("user", user);
        if (!user)
            throw apiError_1.ApiError.badRequest(`Invalid credentials`);
        const matchPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!matchPassword)
            throw apiError_1.ApiError.badRequest("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role,
        }, config_1.default.JWT_SECRET, { expiresIn: config_1.default.JWT_EXPIRY });
        return { token, user: { id: user.id, email: user.email, role: user.role } };
    });
}
