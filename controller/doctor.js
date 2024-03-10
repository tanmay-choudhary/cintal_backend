const {
  getDoctorModel,
  getAllDoctorModel,
  updateDoctorModel,
} = require("../model/doctor.js");
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
    let data = await getAllDoctorModel();
    return res.status(200).json(data);
  } catch (error) {
    return { error: error.message };
  }
});
exports.updateDoctor = asyncWrapper(async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    const updatedData = req.body;

    const updatedDoctor = await updateDoctorModel(doctorId, updatedData);

    return res.status(200).json(updatedDoctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
