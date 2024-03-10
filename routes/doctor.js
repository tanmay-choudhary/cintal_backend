const express = require("express");
const {
  getDoctor,
  getAllDoctor,
  updateDoctor,
} = require("../controller/doctor.js");
const router = express.Router();

router.get("/get-doctor", getDoctor);
router.get("/get-all-doctor", getAllDoctor);
router.patch("/update-doctor/:id", updateDoctor);

module.exports = router;
