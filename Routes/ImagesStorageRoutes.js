const express = require("express");
const router = express.Router();
const {
  ImagesStoragesGet,
  CreateImagesStorage,
  EditImagesStorages,
  DeleteImagesStorages,
  SoftDeleteImagesStorages,
  GetDeletedImagesStorage,
  RestoreSoftDeletedImagesStorage,
} = require("../Controller/ImageStorageController");
const { upload } = require("../Utils/ImageUpload");

router
  .route("/uploadImagesStorage", upload.single("image"))
  .post(CreateImagesStorage);
router.route("/ImagesStoragegetdeleted").get(GetDeletedImagesStorage);
router
  .route("/restoresoftdeleteImagesStorage/:id")
  .post(RestoreSoftDeletedImagesStorage);
router.route("/ImagesStorageget").get(ImagesStoragesGet);
router.route("/deleteImagesStorage/:id").delete(DeleteImagesStorages);
router
  .route("/updateImagesStorage/:id", upload.single("image"))
  .put(EditImagesStorages);
router.route("/softdeleteImagesStorage/:id").delete(SoftDeleteImagesStorages);

module.exports = router;
