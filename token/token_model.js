const db = require("../db.js");
const asyncWrapper = require("../middleware/asyncWrapper2");

exports.saveRefreshToken = async ({
  uid,
  refreshToken,
  sessionToken,
  createdAt,
  expiryAt,
}) => {
  const docRef = await db
    .collection("refresh_tokens")
    .add({ uid, refreshToken, sessionToken, createdAt, expiryAt });
  return docRef.id;
};

exports.getTokenData = async ({ refreshToken }) => {
  const snapshot = await db
    .collection("refresh_tokens")
    .where("refreshToken", "==", refreshToken)
    .get();
  if (!snapshot.empty) {
    const refreshTokenData = snapshot.docs[0].data();
    return refreshTokenData;
  } else {
    throw new Error("refreshToken not found : " + refreshToken);
  }
};
exports.deleteRefreshTokenByUid = async (uid) => {
  try {
    const querySnapshot = await db
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

    return { success: true, message: "Refresh token deleted successfully." };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting the refresh token.",
    };
  }
};
