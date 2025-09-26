export class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors: string[] | null;

  constructor(
    statusCode: number,
    message: string = `something went wrong`,
    errors: string[] | null = null,
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (stack) this.stack = stack;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = `Bad Request`, errors: string[] | null = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = `Unauthorized`) {
    return new ApiError(401, message);
  }

  static forbidden(message = `Forbidden`) {
    return new ApiError(403, message);
  }

  static notFound(message = `Not Found`) {
    return new ApiError(404, message);
  }

  static internal(message = `Internal Server Error`) {
    return new ApiError(500, message);
  }
}
