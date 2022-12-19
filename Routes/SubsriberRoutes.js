const express = require("express");
const router = express.Router();
const {
  RegisterSubscriber,
  GetAllSubscriber,
  GetonlyoneSusbcriber,
  LoginSubscriber,
  logOut,
  SubscriberApproval,
  forgotPassword,
  resetPassword,
  GetDeletedSubscriber,
  RestoreSoftDeletedSubscriber,
  TrackHorses,
  UpdateProfile,
} = require("../Controller/SubscriberController");
router.route("/subscribergetdeleted").get(GetDeletedSubscriber);
router
  .route("/restoresoftdeletesubscriber/:id")
  .post(RestoreSoftDeletedSubscriber);
router.route("/getsubscriber").get(GetAllSubscriber);
router.route("/register").post(RegisterSubscriber);
router.route("/trackhorse").post(TrackHorses);
router.route("/login").post(LoginSubscriber);
router.route("/logout").get(logOut);
router.route("/ChangeStatus/:id").put(SubscriberApproval);
router.route("/singlesubscriber/:id").get(GetonlyoneSusbcriber);
router.route("/updatesubscriber/:id").get(UpdateProfile);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
