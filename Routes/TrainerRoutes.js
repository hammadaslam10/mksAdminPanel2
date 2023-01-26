const express = require("express");
const router = express.Router();
const {
  GetTrainer,
  CreateTrainer,
  UpdateTrainer,
  DeleteTrainer,
  SingleTrainer,
  SoftDeleteTrainer,
  GetDeletedTrainer,
  RestoreSoftDeletedTrainer,
  SearchTrainer,
  TrainerMassUpload,
  TrainerDropDown,
} = require("../Controller/TrainerController");
const { upload } = require("../Utils/ImageUpload");
router.route("/trainergetdeleted").get(GetDeletedTrainer);
router.route("/restoresoftdeletetrainer/:id").post(RestoreSoftDeletedTrainer);
router.route("/uploadtrainer", upload.single("image")).post(CreateTrainer);
router
  .route("/TrainerMassUpload", upload.single("image"))
  .post(TrainerMassUpload);
router.route("/trainerget").get(GetTrainer);
router.route("/TrainerDropDown").get(TrainerDropDown);
router.route("/SearchTrainer").get(SearchTrainer);
router.route("/singletrainerget/:id").get(SingleTrainer);
router.route("/deletetrainer/:id").delete(DeleteTrainer);
router.route("/softdeletetrainer/:id").delete(SoftDeleteTrainer);
router.route("/updatetrainer/:id", upload.single("image")).put(UpdateTrainer);

module.exports = router;
