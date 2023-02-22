class ApiResult {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg) {
    return new ApiResult(400, msg);
  }
  static unauthorized(msg) {
    return new ApiResult(401, msg);
  }
  static internal(msg) {
    return new ApiResult(500, msg);
  }

  static success(msg) {
    return new ApiResult(200, msg);
  }
  static createSuccess(msg) {
    return new ApiResult(201, msg);
  }
}

module.exports = ApiResult;
