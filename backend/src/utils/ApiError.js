import { ApiResponse } from "./ApiResponse.js";

class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
    }

    toResponse() {
        return ApiResponse.failure(this.message, this.statusCode).send(res);
    }
}

class InternalServerException extends ApiError {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}

class UnauthorizedException extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
} 

class ForbiddenException extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export { ApiError, InternalServerException, UnauthorizedException, ForbiddenException };