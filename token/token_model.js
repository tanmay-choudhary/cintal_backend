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
