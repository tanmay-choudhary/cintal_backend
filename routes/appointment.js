const express = require("express");
const {
  bookAppointment,
  getAppointments,
} = require("../controller/appointment.js");
const router = express.Router();

router.post("/book-appointment", bookAppointment);
router.get("/get-appointments", getAppointments);

module.exports = router;
