class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }
  static unauthorized(msg) {
    return new ApiError(401, msg);
  }
  static internal(msg) {
    return new ApiError(500, msg);
  }

  static success(msg) {
    return new ApiError(200, msg);
  }
  static createSuccess(msg) {
    return new ApiError(201, msg);
  }
}

module.exports = ApiError;
