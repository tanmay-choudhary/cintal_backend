const db = require("../db.js");

const verifyPassword = async ({ email, password }) => {
  try {
    let user = await db
      .collection("patients")
      .where("email", "==", email)
      .get();

    if (user.empty) {
      user = await db.collection("doctors").where("email", "==", email).get();

      if (user.empty) {
        return { status: false, message: "User not found." };
      }
    }
    const userData = user.docs[0].data();
    if (userData.password !== password) {
      return { status: false, message: "Incorrect password." };
    }

    return {
      status: true,
      message: "Authentication successful.",
      user: userData,
    };
  } catch (error) {
    return {
      status: false,
      message: "An error occurred during authentication.",
    };
  }
};

module.exports = { verifyPassword };
