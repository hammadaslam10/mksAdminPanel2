const express = require("express");
const router = express.Router();
// const {
//   authorizedRoles,
//   isAuthenticatedUser,
// } = require("../Middleware/AuthenticationAndValidation");
// isAuthenticatedUser, authorizedRoles("approveduser"),
const {
  RegisterAdmin,
  GetAllAdmin,
  GetonlyoneAdmin,
  LoginAdmin,
  logOut,
  AdminApproval,
  forgotPassword,
  resetPassword,
} = require("../Controller/AdminController");
router.route("/getAdmin").get(GetAllAdmin);
router.route("/register").post(RegisterAdmin);
router.route("/login").post(LoginAdmin);
router.route("/register").post(RegisterAdmin);
router.route("/logout").get(logOut);
router.route("/ChangeStatus/:id").put(AdminApproval);
router.route("/singleAdmin/:id").get(GetonlyoneAdmin);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
