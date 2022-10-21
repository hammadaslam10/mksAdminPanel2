const HandlerCallBack = require("../Utils/HandlerCallBack");
const TrackError = require("./TrackError");
const jwt = require("jsonwebtoken");
const SubscriberModel = require("../Models/SubscriberModel");
const AdminModel = require("../Models/AdminModel");
exports.isAuthenticatedUser = TrackError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new HandlerCallBack("Please login to access this resource", 401)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await SubscriberModel.findById(decodedData.id).select("+role");

  next();
});

exports.isAuthenticatedAdmin = TrackError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new HandlerCallBack("Please login to access this resource", 401)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await AdminModel.findById(decodedData.id).select("+role");
  next();
});

exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HandlerCallBack(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
