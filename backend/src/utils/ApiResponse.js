class ApiResponse {
  constructor(success, message, statusCode, data = null) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data ?? null;
  }

  static success(data = null, message = null, statusCode = 200) {
    return new ApiResponse(true, message, statusCode, data);
  }

  static failure(message, statusCode = 400) {
    return new ApiResponse(false, message, statusCode, null);
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export { ApiResponse };