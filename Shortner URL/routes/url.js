const express = require("express");
const router = express.Router();
const {
  handlegenerateshorturl,
  handlegetanalytics,
} = require("../controllers/url");

router.post("/", handlegenerateshorturl);
router.get("/analytics/:shortid", handlegetanalytics);

module.exports = router;
