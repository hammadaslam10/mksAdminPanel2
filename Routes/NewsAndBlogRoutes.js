const express = require("express");
const router = express.Router();
const {
  CreateNewsAndBlog,
  NewsGet,
  DeleteNews,
  EditNews,
  SearchNews,
  SoftDeleteNews,
  GetDeletedNews,
  RestoreSoftDeletedNews,
  NewsTicker,
} = require("../Controller/NewsAndBlogController");
const { upload } = require("../Utils/ImageUpload");
router.route("/newsgetdeleted").get(GetDeletedNews);
router.route("/NewsTicker").get(NewsTicker);
router.route("/restoresoftdeletenews/:id").post(RestoreSoftDeletedNews);
router.route("/uploadnews", upload.single("image")).post(CreateNewsAndBlog);
router.route("/newsget").get(NewsGet);
router.route("/deletenews/:id").delete(DeleteNews);
router.route("/softdeletenews/:id").delete(SoftDeleteNews);
router.route("/updatenews/:id", upload.single("image")).put(EditNews);

module.exports = router;
