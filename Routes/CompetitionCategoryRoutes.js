const express = require("express");
const router = express.Router();
const {
  CompetitionCategoryGet,
  CreateCompetitionCategory,
  EditCompetitionCategory,
  DeleteCompetitionCategory,
  SoftDeleteCompetitionCategory,
  SingleCompetitonCategoryGet,
  RestoreSoftDeletedCompetitionCategory,
  GetDeletedCompetitionCategory,
  SearchCompetitionCategory,
} = require("../Controller/CompetitionCategoryController");
router
  .route("/competitioncategorygetdeleted")
  .get(GetDeletedCompetitionCategory);
router.route("/competitioncategorygetdeleted").get(SearchCompetitionCategory);
router
  .route("/restoresoftdeletecompetitioncategory/:id")
  .post(RestoreSoftDeletedCompetitionCategory);
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
