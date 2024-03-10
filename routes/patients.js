const express = require("express");
const {
  test,
  createPatient,
  getPatient,
  getAllPatients,
  updatePatient,
} = require("../controller/patient.js");
const router = express.Router();

//testing route
router.get("/test", async (req, res, next) => {
  let data = await test("i am testing");
  res.send(data);
});
//

router.post("/create-patient", createPatient);
router.get("/get-patient", getPatient);
router.get("/get-all-patient", getAllPatients);
router.patch("/update-patient/:id", updatePatient);
module.exports = router;
