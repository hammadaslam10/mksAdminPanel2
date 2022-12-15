const express = require("express");
const router = express.Router();
const { AddNewsLetter } = require("../Controller/NewsLetterController");
router.route("/addnewsletter").post(AddNewsLetter);

module.exports = router;
