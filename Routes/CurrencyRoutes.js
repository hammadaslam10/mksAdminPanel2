const express = require("express");
const router = express.Router();
const {
  CurrencyGet,
  CreateCurrency,
  EditCurrency,
  DeleteCurrency,
  SoftDeleteCurrency,
  GetCurrencyMaxShortCode,
  GetDeletedCurrency,
  RestoreSoftDeletedCurrency,
} = require("../Controller/CurrencyController");
const { upload } = require("../Utils/ImageUpload");
router.route("/currencygetdeleted").get(GetDeletedCurrency);
router.route("/restoresoftdeletecurrency/:id").post(RestoreSoftDeletedCurrency);
router.route("/getcurrencyshortcode").get(GetCurrencyMaxShortCode);
router.route("/uploadCurrency", upload.single("image")).post(CreateCurrency);
router.route("/Currencyget").get(CurrencyGet);
router.route("/deleteCurrency/:id").delete(DeleteCurrency);
router.route("/updateCurrency/:id", upload.single("image")).put(EditCurrency);
router.route("/softdeleteCurrency/:id").delete(SoftDeleteCurrency);
module.exports = router;
