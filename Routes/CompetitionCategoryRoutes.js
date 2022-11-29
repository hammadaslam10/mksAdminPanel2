const express = require("express");
const router = express.Router();
const {
  CompetitionCategoryGet,
  CreateCompetitionCategory,
  EditCompetitionCategory,
  DeleteCompetitionCategory,
  SoftDeleteCompetitionCategory,
  SingleCompetitonCategoryGet
} = require("../Controller/CompetitionCategoryController");
const { upload } = require("../Utils/ImageUpload");

router
  .route("/uploadCompetitionCategory", upload.single("image"))
  .post(CreateCompetitionCategory);
router.route("/CompetitionCategoryget").get(CompetitionCategoryGet);
router
  .route("/deleteCompetitionCategory/:id")
  .delete(DeleteCompetitionCategory);
router
  .route("/updateCompetitionCategory/:id", upload.single("image"))
  .put(EditCompetitionCategory);
router
  .route("/softdeleteCompetitionCategory/:id")
  .delete(SoftDeleteCompetitionCategory);
router.route("/getCompetitionCategory/:id").get(SingleCompetitonCategoryGet);
module.exports = router;
