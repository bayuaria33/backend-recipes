const jwt = require("jsonwebtoken");
const ApiResult = require("../middleware/error/ApiResult");
let key = process.env.JWT_KEY;

const protect = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      let auth = req.headers.authorization;
      token = auth.split(" ")[1];
      let decode = jwt.verify(token, key);
      req.payload = decode;
      next();
    } else {
      next(ApiResult.badRequest(`Server token not found, please login`));
      return;
    }
  } catch (error) {
    if (error && error.name == "JsonWebTokenError") {
      next(ApiResult.badRequest(`Login failed, server token invalid`));
      return;
    } else if (error && error.name == "TokenExpiredError") {
      next(ApiResult.badRequest(`Login failed, server token expired`));
      return;
    } else {
      next(ApiResult.badRequest(`Login failed, please try again`));
      return;
    }
  }
};

module.exports = { protect };
