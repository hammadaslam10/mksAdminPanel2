const express = require("express");
const router = express.Router();
const {
  GetHorse,
  CreateHorse,
  UpdateHorse,
  DeleteHorse,
  SingleHorse,
  SearchName,
  GetDeletedHorse,
  RestoreSoftDeletedHorse,
  PedigreeHorse,
  SoftDeleteHorse,
  SearchHorse,
  HorseMassUpload,
  HorseDropDown,
  RaceHorse,
} = require("../Controller/HorseController");
router.route("/horsegetdeleted").get(GetDeletedHorse);
router.route("/horserace/:raceid").get(RaceHorse);
router.route("/SearchHorse").get(SearchHorse);
router.route("/pedigreehorse/:id").get(PedigreeHorse);
router.route("/restoresoftdeletehorse/:id").post(RestoreSoftDeletedHorse);
router.route("/gethorse").get(GetHorse);
router.route("/HorseDropDown").get(HorseDropDown);
router.route("/searchhorse_trainer_jockey").post(SearchName);
router.route("/HorseMassUpload").post(HorseMassUpload);
router.route("/getsinglehorse/:id").get(SingleHorse);
router.route("/createhorse").post(CreateHorse);
router.route("/updatehorse/:id").put(UpdateHorse);
router.route("/softdeletehorse/:id").delete(SoftDeleteHorse);
module.exports = router;
