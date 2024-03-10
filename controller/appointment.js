const {
  bookAppointmentModel,
  getAppointmentsById,
} = require("../model/appointment.js");
const asyncWrapper = require("../middleware/asyncWrapper");

exports.bookAppointment = asyncWrapper(async (req, res, next) => {
  try {
    const data = req.body;

    const response = await bookAppointmentModel(data);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

exports.getAppointments = asyncWrapper(async (req, res, next) => {
  try {
    const { patientId, doctorId } = req.query;
    let appointments;
    if (patientId) {
      appointments = await getAppointmentsById(patientId, "Patient");
    } else if (doctorId) {
      appointments = await getAppointmentsById(doctorId, "Doctor");
    } else {
      return res.status(404);
    }
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
