const { createPatientModel } = require("../model/patient.js");
const { createDoctorModel } = require("../model/doctor.js");
const loginHelper = require("./login_helper");
const asyncWrapper = require("../middleware/asyncWrapper");

exports.test = asyncWrapper(async (req, res, next) => {
  let data = "i am testing auth";
  res.send(data);
});

exports.signup = asyncWrapper(async (req, res, next) => {
  let { name, email, password, role, otp_token } = req.body;
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

  if (!otp_token) {
    flag = false;
    message = "token cannot be empty";
  }
  if (name && email && password && role) {
    let createdAt = new Date();

    // switch (role) {
    //   case "patient":
    //     return res.json(
    //       await createPatientModel({
    //         name,
    //         email,
    //         password,
    //         role,
    //         createdAt,
    //       })
    //     );
    //   case "doctor":
    //     return res.json(
    //       await createDoctorModel({
    //         name,
    //         email,
    //         password,
    //         role,
    //         createdAt,
    //       })
    //     );
    // }
  } else {
    return res.json({ error: "Incomplete User data" });
  }
});

exports.login = asyncWrapper(async (req, res) => {
  let { email, type, otp, password } = req.body;
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
  } else if (type.toUpperCase() === "OTP") {
    if (!otp) {
      flag = false;
      message = "OTP cannot be empty";
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
