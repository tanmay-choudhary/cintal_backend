const { getPatientModel, createPatientModel } = require("../model/patient.js");
const { getDoctorModel, createDoctorModel } = require("../model/doctor.js");
const TOKEN_LIB = require("../libs/token");
const loginHelper = require("./login_helper");
const asyncWrapper = require("../middleware/asyncWrapper");

exports.test = asyncWrapper(async (req, res, next) => {
  let data = "i am testing auth";
  res.send(data);
});

exports.signup = asyncWrapper(async (req, res, next) => {
  let { name, email, password, role } = req.body;
  let status = 400;
  let flag = true;

  if (!email) {
    flag = false;
    message = "Email cannot be empty";
  } else {
    email = email.toLowerCase();
  }
  if (!password) {
    flag = false;
    message = "Password cannot be empty";
  }
  let createdAt = new Date();
  if (flag) {
    //Check user already exists or not.
    const searchUser =
      role == "patient"
        ? await getPatientModel("", email)
        : await getDoctorModel("", email);
    if (!searchUser.length) {
      //verify the otp_token.
      const TOKEN = new TOKEN_LIB();

      const createUser =
        role == "patient"
          ? await createPatientModel({
              email,
              password,
              name,
              role,
              createdAt,
            })
          : await createDoctorModel({
              email,
              password,
              name,
              role,
              createdAt,
            });

      //generating refresh_token
      const refreshToken = await TOKEN.createRefreshToken({
        uid: createUser.uid,
      });
      if (refreshToken) {
        status = 200;
        const userData =
          role == "patient"
            ? await getPatientModel("", email)
            : await getPatientModel("", email);
        res.status(status).json({
          refresh_token: refreshToken,
          user: userData[0],
        });
      } else {
        res.status(status).json({
          message: "failed to generate token",
        });
      }
    } else {
      res.status(status).json({
        message: "User is registered already",
      });
    }
  } else {
    res.status(status).json({
      message: "Please fill all data",
    });
  }
});

exports.login = asyncWrapper(async (req, res) => {
  let { email, type, password } = req.body;
  let status = 400;
  let flag = true;
  let message = "";

  if (!type) {
    flag = false;
    message = "type cannot be empty";
  }

  if (!email) {
    flag = false;
    message = "Email cannot be empty";
  } else {
    email = email.toLowerCase();
  }

  if (type.toUpperCase() === "PASSWORD") {
    if (!password) {
      flag = false;
      message = "password cannot be empty";
    }
  }

  if (flag) {
    type = type.toUpperCase();
    switch (type) {
      case "PASSWORD":
        // the function will the send the response/error
        loginHelper.loginWithPassword({
          email,
          password,
          req,
          res,
        });
        break;
      default:
        res.status(status).json({
          message: "invalid login type",
        });
        break;
    }
  } else {
    res.status(status).json({
      message: message,
    });
  }
});
