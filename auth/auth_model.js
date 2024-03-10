const db = require("../db.js");
const sessionHelper = require("../helpers/session");

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

const deleteSessionToken = async ({ uid, sessionToken }) => {
  let responseData = { status: true };

  const deleteStatus = await sessionHelper.deleteSessionToken(sessionToken);
  if (deleteStatus.status) {
    let querySnapshot = await db
      .collection("refresh_tokens")
      .where("uid", "==", uid)
      .get();
    if (querySnapshot.empty) {
      return {
        success: false,
        message: "Refresh token not found for the provided UID.",
      };
    }
    const batch = db.batch();
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    responseData = {
      status: true,
      message: "Refresh token deleted successfully.",
    };
  } else {
    responseData.status = false;
  }

  return responseData;
};
module.exports = { deleteSessionToken, verifyPassword };
