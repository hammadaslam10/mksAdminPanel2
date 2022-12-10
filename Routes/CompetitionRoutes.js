const express = require("express");
const router = express.Router();
const {
  CompetitonGet,
  CreateCompetiton,
  EditCompetiton,
  DeleteCompetiton,
  SoftDeleteCompetiton,
  SingleCompetitonGet,
  AddRacesInCompetition,
  GetRaceforCompetition,
} = require("../Controller/CompetitonController");
const { upload } = require("../Utils/ImageUpload");
router
  .route("/uploadCompetiton", upload.single("image"))
  .post(CreateCompetiton);
router.route("/Competitonget").get(CompetitonGet);
router.route("/GetRaceforCompetition").get(GetRaceforCompetition);
router.route("/deleteCompetiton/:id").delete(DeleteCompetiton);
router
  .route("/updateCompetiton/:id", upload.single("image"))
  .put(EditCompetiton);
router.route("/softdeleteCompetiton/:id").delete(SoftDeleteCompetiton);
router.route("/getCompetiton/:id").get(SingleCompetitonGet);
router.route("/addraceincompetition/:id").post(AddRacesInCompetition);
module.exports = router;
