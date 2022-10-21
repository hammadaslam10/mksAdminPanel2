const express = require("express");
const router = express.Router();
const {
  GetTrainer,
  CreateTrainer,
  UpdateTrainer,
  DeleteTrainer,
  SingleTrainer,
} = require("../Controller/TrainerController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadtrainer", upload.single("image")).post(CreateTrainer);
router.route("/trainerget").get(GetTrainer);
router.route("/singletrainerget").get(SingleTrainer);
router.route("/deletetrainer/:id").delete(DeleteTrainer);
router.route("/updatetrainer/:id", upload.single("image")).put(UpdateTrainer);

module.exports = router;
