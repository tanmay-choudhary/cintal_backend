const {
  createPatientModel,
  getPatientByPatientId,
  getAllPatientsModel,
} = require("../model/patient.js");
const asyncWrapper = require("../middleware/asyncWrapper");

exports.createPatient = asyncWrapper(async (req, res, next) => {
  let { name, email, password, role } = req.body;
  if (name && email && password && role) {
    let createdAt = new Date();

    return res.json(
      await createPatientModel({
        name,
        email,
        password,
        role,
        createdAt,
      })
    );
  } else {
    return res.json({ error: "Incomplete patient data" });
  }
});

exports.getPatient = asyncWrapper(async (req, res, next) => {
  let { patientId } = req.query;
  if (patientId) {
    let data = await getPatientByPatientId(patientId);
    return res.status(200).json(data);
  } else {
    return res.json({ error: "PatientId not found" });
  }
});

exports.getAllPatients = asyncWrapper(async (req, res, next) => {
  try {
    return await getAllPatientsModel();
  } catch (error) {
    return { error: error.message };
  }
});
