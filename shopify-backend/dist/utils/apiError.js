"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message = `something went wrong`, errors = null, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        if (stack)
            this.stack = stack;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message = `Bad Request`, errors = null) {
        return new ApiError(400, message, errors);
    }
    static unauthorized(message = `Unauthorized`) {
        return new ApiError(401, message);
    }
    static forbidden(message = `Forbidden`) {
        return new ApiError(403, message);
    }
    static nofFound(message = `Not Found`) {
        return new ApiError(404, message);
    }
    static internal(message = `Internal Server Error`) {
        return new ApiError(500, message);
    }
}
exports.ApiError = ApiError;
