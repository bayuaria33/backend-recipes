const ApiResult = require("./ApiResult");

function apiErrorHandler(err, req, res, next) {
  // in prod, don't use console.log or console.err because
  // it is not async
  console.error(err);

  if (err instanceof ApiResult) {
    res.status(err.code).json({status:err.code, message:err.message, data:err.data});
    return;
  }

  res.status(500).json("something went wrong");
}

module.exports = apiErrorHandler;
