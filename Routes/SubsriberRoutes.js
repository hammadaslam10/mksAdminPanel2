const express = require("express");
const router = express.Router();
// const {
//   authorizedRoles,
//   isAuthenticatedUser,
// } = require("../Middleware/AuthenticationAndValidation");
// isAuthenticatedUser, authorizedRoles("approveduser"),
const {
  RegisterSubscriber,
  GetAllSubscriber,
  GetonlyoneSusbcriber,
  LoginSubscriber,
  logOut,
  SubscriberApproval,
  forgotPassword,
  resetPassword,

} = require("../Controller/SubscriberController");
router.route("/getsubscriber").get(GetAllSubscriber);
router.route("/register").post(RegisterSubscriber);
router.route("/login").post(LoginSubscriber);
router.route("/register").post(RegisterSubscriber);
router.route("/logout").get(logOut);
router.route("/ChangeStatus/:id").put(SubscriberApproval);
router.route("/singlesubscriber/:id").get(GetonlyoneSusbcriber);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
