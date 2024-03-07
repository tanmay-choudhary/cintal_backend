const { getDoctorModel, getAllDoctorModel } = require("../model/doctor.js");
const asyncWrapper = require("../middleware/asyncWrapper");

exports.getDoctor = asyncWrapper(async (req, res, next) => {
  let { doctorId } = req.query;
  if (doctorId) {
    let data = await getDoctorModel(doctorId);
    return res.status(200).json(data);
  } else {
    return res.json({ error: "DoctorId not found" });
  }
});

exports.getAllDoctor = asyncWrapper(async (req, res, next) => {
  try {
    return await getAllDoctorModel();
  } catch (error) {
    return { error: error.message };
  }
});
