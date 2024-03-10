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
      name: doc.data().name,
      doctorId: doc.data().doctorId,
      specialisation: doc.data().specialisation,
      availability: doc.data().availability,
    });
  });

  return doctors;
});

exports.updateDoctorModel = asyncWrapper(async (doctorId, newData) => {
  const doctorQuerySnapshot = await db
    .collection("doctors")
    .where("doctorId", "==", doctorId)
    .get();

  if (doctorQuerySnapshot.empty) {
    throw new Error("Doctor not found"); // Throw an error if the doctor with the specified ID doesn't exist
  }

  const doctorDocRef = doctorQuerySnapshot.docs[0].ref; // Get the reference to the first (and hopefully only) document in the query result

  await doctorDocRef.update(newData); // Update the document with the new data

  return "Doctor updated successfully"; // Return success message
});
