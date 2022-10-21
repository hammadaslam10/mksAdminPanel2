const HandlerCallBack = require("../Utils/HandlerCallBack");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new HandlerCallBack(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new HandlerCallBack(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid`;
    err = new HandlerCallBack(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired`;
    err = new HandlerCallBack(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
