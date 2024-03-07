const db = require("../db.js");
const asyncWrapper = require("../middleware/asyncWrapper2");

exports.createPatientModel = asyncWrapper(
  async ({ name, email, password, role, createdAt }) => {
    const snapshot = await db.collection("patients").get();
    const numberOfPatients = snapshot.size;
    const patientId =
      "patient" + (numberOfPatients + 1).toString().padStart(2, "0");

    const docRef = await db
      .collection("patients")
      .add({ name, email, password, role, createdAt, patientId });
    return { uid: docRef.id };
  }
);
exports.getPatientModel = asyncWrapper(async (patientId, email) => {
  let snapshot;
  if (patientId && patientId != "") {
    snapshot = await db
      .collection("patients")
      .where("patientId", "==", patientId)
      .get();
  } else if (email && email != "") {
    snapshot = await db
      .collection("patients")
      .where("email", "==", email)
      .get();
  } else {
    throw new Error("Please provide either patientId or email.");
  }

  if (!snapshot.empty) {
    const patientData = snapshot.docs[0].data();
    return [patientData];
  } else {
    return [];
  }
});
exports.getAllPatientsModel = asyncWrapper(async () => {
  const snapshot = await db.collection("patients").get();
  const patients = [];

  snapshot.forEach((doc) => {
    patients.push({
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),

      email: doc.data().email,
      name: doc.data().name,
      password: doc.data().password,
      patientId: doc.data().patientId,
      role: doc.data().role,
    });
  });

  return patients;
});

exports.updatePatientModel = asyncWrapper(async (patientId, newData) => {
  await db
    .collection("patients")
    .where("patientId", "==", patientId)
    .update(newData);
  return "Patient updated successfully";
});
