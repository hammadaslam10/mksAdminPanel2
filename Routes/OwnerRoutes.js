const express = require("express");
const router = express.Router();
const {
  CreateOwner,
  UpdateOwnerDetail,
  UpdateOwnerHorse,
  ViewASingleOwner,
  ViewAllOwner,
  DeleteOwner,
  SoftDeleteOwner,
  GetDeletedOwner,
  RestoreSoftDeletedOwner,
  SearchOwner,
} = require("../Controller/OwnerController");
const { upload } = require("../Utils/ImageUpload");
router.route("/ownergetdeleted").get(GetDeletedOwner);
router.route("/restoresoftdeleteowner/:id").post(RestoreSoftDeletedOwner);
router.route("/getsingleowner/:id").get(ViewASingleOwner);
router.route("/createowner", upload.array("image")).post(CreateOwner);
router.route("/Ownerget").get(ViewAllOwner);
router.route("/SearchOwner").get(SearchOwner);
router.route("/deleteOwner/:id").delete(DeleteOwner);
router.route("/updateOwner/:id", upload.single("image")).put(UpdateOwnerDetail);
router.route("/softdeleteowner/:id").delete(SoftDeleteOwner);
module.exports = router;
