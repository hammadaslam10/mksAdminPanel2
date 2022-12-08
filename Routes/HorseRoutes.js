const express = require("express");
const router = express.Router();
const {
  GetHorse,
  CreateHorse,
  UpdateHorse,
  DeleteHorse,
  SingleHorse,
  SearchName,
} = require("../Controller/HorseController");
router.route("/gethorse").get(GetHorse);
router.route("/searchhorse_trainer_jockey").post(SearchName);
router.route("/getsinglehorse/:id").get(SingleHorse);
router.route("/createhorse").post(CreateHorse);
router.route("/updatehorse/:id").put(UpdateHorse);
router.route("/deletehorse/:id").delete(DeleteHorse);
module.exports = router;
