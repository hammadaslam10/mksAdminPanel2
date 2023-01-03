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
  TrackTrainers,
  TrackOwners,
  SearchUser,
} = require("../Controller/SubscriberController");
router.route("/subscribergetdeleted").get(GetDeletedSubscriber);
router
  .route("/restoresoftdeletesubscriber/:id")
  .post(RestoreSoftDeletedSubscriber);
router.route("/getsubscriber").get(GetAllSubscriber);
router.route("/register").post(RegisterSubscriber);
router.route("/trackhorse").post(TrackHorses);
router.route("/tracktrainer").post(TrackTrainers);
router.route("/trackowner").post(TrackOwners);
router.route("/login").post(LoginSubscriber);
router.route("/logout").get(logOut);
router.route("/SearchUser").get(SearchUser);
router.route("/ChangeStatus/:id").put(SubscriberApproval);
router.route("/singlesubscriber/:id").get(GetonlyoneSusbcriber);
router.route("/updatesubscriber/:id").put(UpdateProfile);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


module.exports = router;
