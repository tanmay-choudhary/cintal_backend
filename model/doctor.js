const db = require("../db.js");
const asyncWrapper = require("../middleware/asyncWrapper2");

exports.createDoctorModel = asyncWrapper(
  async ({ name, email, password, role, createdAt }) => {
    const snapshot = await db.collection("doctors").get();
    const numberOfDoctors = snapshot.size;
    const doctorId =
      "doctor" + (numberOfDoctors + 1).toString().padStart(2, "0");

    const docRef = await db
      .collection("doctors")
      .add({ name, email, password, role, createdAt, doctorId });
    return { uid: docRef.id };
  }
);
exports.getDoctorModel = asyncWrapper(async (doctorId, email) => {
  let snapshot;
  if (doctorId && doctorId != "") {
    snapshot = await db
      .collection("doctors")
      .where("doctorId", "==", doctorId)
      .get();
  } else if (email && email != "") {
    snapshot = await db.collection("doctors").where("email", "==", email).get();
  } else {
    throw new Error("Please provide either doctorId or email.");
  }
  if (!snapshot.empty) {
    const doctorData = snapshot.docs[0].data();
    return [doctorData];
  } else {
    return [];
  }
});
exports.getAllDoctorModel = asyncWrapper(async () => {
  const snapshot = await db.collection("doctors").get();
  const doctors = [];

  snapshot.forEach((doc) => {
    doctors.push({
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
      email: doc.data().email,
      name: doc.data().name,
      password: doc.data().password,
      doctorId: doc.data().doctorId,
      role: doc.data().role,
    });
  });

  return doctors;
});

exports.updateDoctorModel = asyncWrapper(async (doctorId, newData) => {
  await db
    .collection("doctors")
    .where("doctorId", "==", doctorId)
    .update(newData);
  return "Patient updated successfully";
});
