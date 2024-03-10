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
      name: doc.data().name,
      patientId: doc.data().patientId,
      age: doc.data().age,
      height: doc.data().height,
      weight: doc.data().weight,
      bloodGroup: doc.data().bloodGroup,
      issue: doc.data().issue,
      image: doc.data().img,
    });
  });

  return patients;
});

exports.updatePatientModel = asyncWrapper(async (patientId, newData) => {
  const patientQuerySnapshot = await db
    .collection("patients")
    .where("patientId", "==", patientId)
    .get();

  if (patientQuerySnapshot.empty) {
    throw new Error("Doctor not found"); // Throw an error if the doctor with the specified ID doesn't exist
  }

  const patientDocRef = patientQuerySnapshot.docs[0].ref; // Get the reference to the first (and hopefully only) document in the query result

  await patientDocRef.update(newData); // Update the document with the new data

  return "Patient updated successfully"; // Return success message
});
