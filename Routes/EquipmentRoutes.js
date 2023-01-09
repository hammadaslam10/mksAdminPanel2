const express = require("express");
const router = express.Router();
const {
  EquipmentGet,
  CreateEquipment,
  EditEquipment,
  DeleteEquipment,
  SoftDeleteEquipment,
  GetEquipmentMaxShortCode,
  GetDeletedEquipment,
  RestoreSoftDeletedEquipment,
  EquipmentMassUpload,
} = require("../Controller/EquipmentController");
const { upload } = require("../Utils/ImageUpload");
router.route("/equipmentgetdeleted").get(GetDeletedEquipment);
router
  .route("/restoresoftdeleteequipment/:id")
  .post(RestoreSoftDeletedEquipment);
router.route("/getequipmentshortcode").get(GetEquipmentMaxShortCode);
router.route("/uploadEquipment", upload.single("image")).post(CreateEquipment);
router
  .route("/EquipmentMassUpload", upload.single("image"))
  .post(EquipmentMassUpload);
router.route("/Equipmentget").get(EquipmentGet);
router.route("/deleteEquipment/:id").delete(DeleteEquipment);
router.route("/updateEquipment/:id", upload.single("image")).put(EditEquipment);
router.route("/softdeleteEquipment/:id").delete(SoftDeleteEquipment);
module.exports = router;
