const express = require("express");
const router = express.Router();
const {
  CreateOwner,
  UpdateOwnerDetail,
  UpdateOwnerHorse,
  ViewASingleOwner,
  ViewAllOwner
} = require("../Controller/OwnerController");
const { upload } = require("../Utils/ImageUpload");

router.route("/createowner", upload.single("image")).post(CreateOwner);
router.route("/Ownerget").get(ViewAllOwner);
// router.route("/deleteOwner/:id").delete(DeleteOwner);
// router.route("/updateOwner/:id", upload.single("image")).put(EditOwner);
// router.post("/softdeleteOwner/:id").post(SoftDelete);
module.exports = router;
