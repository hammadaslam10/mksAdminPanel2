const express = require("express");
const router = express.Router();
const {
  EquipmentGet,
  CreateEquipment,
  EditEquipment,
  DeleteEquipment,
  SoftDeleteEquipment,
} = require("../Controller/EquipmentController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadEquipment", upload.single("image")).post(CreateEquipment);
router.route("/Equipmentget").get(EquipmentGet);
router.route("/deleteEquipment/:id").delete(DeleteEquipment);
router.route("/updateEquipment/:id", upload.single("image")).put(EditEquipment);
router.route("/softdeleteEquipment/:id").delete(SoftDeleteEquipment);
module.exports = router;
