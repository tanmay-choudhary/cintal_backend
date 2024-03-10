const db = require("../db.js");
const asyncWrapper = require("../middleware/asyncWrapper2");

exports.bookAppointmentModel = asyncWrapper(
  async ({ start, color, title, doctorId, patientId }) => {
    let createdAt = new Date();
    const snapshot = await db.collection("appointments").get();
    const numberOfAppointments = snapshot.size;
    const appointmentId =
      "appointment" + (numberOfAppointments + 1).toString().padStart(2, "0");

    const docRef = await db.collection("appointments").add({
      start,
      color,
      title,
      doctorId,
      patientId,
      createdAt,
      appointmentId,
    });
    return { uid: docRef.id };
  }
);

exports.getAppointmentsById = asyncWrapper(async (id, role) => {
  const appointmentsRef = db.collection("appointments");
  let querySnapshot;
  if (role == "Patient") {
    querySnapshot = await appointmentsRef.where("patientId", "==", id).get();
  } else {
    querySnapshot = await appointmentsRef.where("doctorId", "==", id).get();
  }
  const appointments = [];
  querySnapshot.forEach((doc) => {
    const { title, color, start, doctorId } = doc.data();
    appointments.push({ title, color, start, doctorId });
  });

  return appointments;
});
