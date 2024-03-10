const {
  createPatientModel,
  getPatientModel,
  getAllPatientsModel,
  updatePatientModel,
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
    let data = await getPatientModel(patientId);
    return res.status(200).json(data);
  } else {
    return res.json({ error: "PatientId not found" });
  }
});

exports.getAllPatients = asyncWrapper(async (req, res, next) => {
  try {
    let data = await getAllPatientsModel();
    return res.status(200).json(data);
  } catch (error) {
    return { error: error.message };
  }
});

exports.updatePatient = asyncWrapper(async (req, res, next) => {
  try {
    const patientId = req.params.id;
    const updatedData = req.body;

    const updatedPatient = await updatePatientModel(patientId, updatedData);

    return res.status(200).json(updatedPatient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
