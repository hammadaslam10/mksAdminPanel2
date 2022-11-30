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
} = require("../Controller/OwnerController");
const { upload } = require("../Utils/ImageUpload");
router.route("/getsingleowner/:id").get(ViewASingleOwner);
router.route("/createowner", upload.array("image")).post(CreateOwner);
router.route("/Ownerget").get(ViewAllOwner);
router.route("/deleteOwner/:id").delete(DeleteOwner);
router.route("/updateOwner/:id", upload.single("image")).put(UpdateOwnerDetail);
router.post("/softdeleteOwner/:id").post(SoftDeleteOwner);
module.exports = router;
