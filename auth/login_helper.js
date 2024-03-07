const authModel = require("./auth_model");
const { getPatientModel } = require("../model/patient.js");
const { getDoctorModel } = require("../model/doctor.js");
const TOKEN_LIB = require("../libs/token");

async function loginWithPassword({ email, password, req, res }) {
  let userData = await getPatientModel("", email);
  if (!userData?.length) {
    userData = await getDoctorModel("", email);
  }

  if (userData?.length) {
    const verifyPassword = await authModel.verifyPassword({
      email,
      password,
    });
    if (verifyPassword.status) {
      const token = new TOKEN_LIB();
      const refreshToken = await token.createRefreshToken({
        uid:
          userData[0].role == "patient"
            ? userData[0].patientId
            : userData[0].doctorId,
      });
      if (refreshToken) {
        res.json({
          refresh_token: refreshToken,
          user: userData[0],
        });
      } else {
        authModel.handleFailedLogin({
          email,
        });
        return res.status(400).json({
          message: "Error while creating refresh token",
        });
      }
    } else {
      return res.status(400).json({
        message: verifyPassword.message,
      });
    }
  } else {
    return res.status(400).json({
      message: "user not found,please create a new account",
    });
  }
}

module.exports = { loginWithPassword };
