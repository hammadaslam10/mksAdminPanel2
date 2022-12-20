const express = require("express");
const router = express.Router();
const {
  AddNewsLetter,
  GetNewsLetter
} = require("../Controller/NewsLetterController");
router.route("/addnewsletter").post(AddNewsLetter);
router.route("/GetNewsLetter").get(GetNewsLetter);

module.exports = router;
