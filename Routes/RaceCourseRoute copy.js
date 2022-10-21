const express = require("express");
const router = express.Router();
const {
  GetCourse,
  CreateRaceCourse,
  UpdateCourse,
  DeleteCourse,
  SingleRaceCourse,
} = require("../Controller/RaceCourseController");
router.route("/getracecourse").get(GetCourse);
router.route("/createcourse").post(CreateRaceCourse);
router.route("/singleracecourse/:id").get(SingleRaceCourse);
router.route("/updatecourse/:id").put(UpdateCourse);
router.route("/deletecourse/:id").delete(DeleteCourse);
module.exports = router;
