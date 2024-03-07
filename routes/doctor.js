const express = require("express");
const { getDoctor, getAllDoctor } = require("../controller/patient.js");
const router = express.Router();

router.get("/get-doctor", getDoctor);
router.get("/get-all-doctor", getAllDoctor);

module.exports = router;
