const express = require("express");
const router = express.Router();
const {
  BreederGet,
  CreateBreeder,
  EditBreeder,
  DeleteBreeder,
  SoftDeleteBreeder,
  SingleBreeder,
  GetBreederMaxShortCode,
  GetBreederAdmin,
  RestoreSoftDeletedBreeder,
  BreederMassUpload,
  GetDeletedBreeder,
} = require("../Controller/BreederController");
const { upload } = require("../Utils/ImageUpload");
router.route("/breedersgetdeleted").get(GetDeletedBreeder);
router.route("/BreederMassUpload").post(BreederMassUpload);
router.route("/restoresoftdeletebreeders/:id").post(RestoreSoftDeletedBreeder);
router.route("/getbreedershortcode").get(GetBreederMaxShortCode);
router.route("/getsinglebreeder/:id").get(SingleBreeder);
router.route("/uploadBreeder", upload.single("image")).post(CreateBreeder);
router.route("/Breederget").get(BreederGet);
router.route("/deleteBreeder/:id").delete(DeleteBreeder);
router.route("/updateBreeder/:id", upload.single("image")).put(EditBreeder);
router.route("/softdeleteBreeder/:id").delete(SoftDeleteBreeder);
module.exports = router;
