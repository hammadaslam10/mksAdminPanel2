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
  RestoreSoftDeletedAdmin,
  GetDeletedAdmin,
  UpdateAdmin
} = require("../Controller/AdminController");
router.route("/Admingetdeleted").get(GetDeletedAdmin);
router.route("/restoresoftdeleteAdmin/:id").post(RestoreSoftDeletedAdmin);
router.route("/getAdmin").get(GetAllAdmin);
router.route("/adminregister").post(RegisterAdmin);
router.route("/adminlogin").post(LoginAdmin);
router.route("/adminlogout").get(logOut);
router.route("/adminChangeStatus/:id").put(AdminApproval);
router.route("/singleAdmin/:id").get(GetonlyoneAdmin);
router.route("/updateadmin/:id").get(UpdateAdmin);
router.route("/adminpassword/forgot").post(forgotPassword);
router.route("/adminpassword/reset/:token").put(resetPassword);

module.exports = router;
