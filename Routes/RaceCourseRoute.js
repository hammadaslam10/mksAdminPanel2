const express = require("express");
const router = express.Router();
const {
  GetCourse,
  CreateRaceCourse,
  UpdateCourse,
  DeleteCourse,
  SingleRaceCourse,
  SoftDeleteCourse,
  GetDeletedRaceCourse,
  RestoreSoftDeletedRaceCourse,
  SearchRaceCourse,
  RaceCourseMassUpload,
} = require("../Controller/RaceCourseController");
router.route("/RaceCourseMassUpload").post(RaceCourseMassUpload);
router.route("/racecoursegetdeleted").get(GetDeletedRaceCourse);
router
  .route("/restoresoftdeleteracecourse/:id")
  .post(RestoreSoftDeletedRaceCourse);
router.route("/getracecourse").get(GetCourse);
router.route("/createcourse").post(CreateRaceCourse);
router.route("/searchracecourse").get(SearchRaceCourse);
router.route("/singleracecourse/:id").get(SingleRaceCourse);
router.route("/updatecourse/:id").put(UpdateCourse);
router.route("/deletecourse/:id").delete(DeleteCourse);
router.route("/softdeletecourse/:id").delete(SoftDeleteCourse);
module.exports = router;
