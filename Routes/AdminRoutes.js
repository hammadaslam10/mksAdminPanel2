const express = require("express");
const router = express.Router();
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
  UpdateAdmin,
  HorseAndRaceMassUpload,
} = require("../Controller/AdminController");
const {
  GetSendNotification,
  TemplateChanging,
} = require("../Controller/PushNotification");
router.route("/GetSendNotification").post(TemplateChanging);
router.route("/HorseAndRaceMassUpload").post(HorseAndRaceMassUpload);

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
