const { getPatientModel, createPatientModel } = require("../model/patient.js");
const { getDoctorModel, createDoctorModel } = require("../model/doctor.js");
const { deleteSessionToken } = require("./auth_model.js");
const tokenModel = require("../token/token_model");
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
      role == "Patient"
        ? await getPatientModel("", email)
        : await getDoctorModel("", email);
    if (!searchUser.length) {
      const TOKEN = new TOKEN_LIB();

      const createUser =
        role == "Patient"
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
          //refresh_token: refreshToken,
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

exports.refreshToken = asyncWrapper(async (req, res) => {
  const { refresh_token, grant_type } = req.body;
  if (refresh_token && grant_type) {
    const token = new TOKEN_LIB();
    switch (grant_type) {
      case "refresh_token": {
        const accessToken = await token.accessToken({
          refreshToken: refresh_token,
        });
        if (accessToken.status) {
          res.json({
            access_token: accessToken.data,
          });
        } else {
          res.status(400).json({
            message: accessToken.error,
          });
        }
        break;
      }
      case "token_validity": {
        const isValid = await token.tokenValidity({
          refreshToken: refresh_token,
        });
        if (isValid) {
          res.json({
            validity: true,
          });
        } else {
          res.status(400).json({
            validity: false,
          });
        }
        break;
      }
      default: {
        res.status(400).json({
          message: "We can not process your request",
        });
        break;
      }
    }
  } else {
    res.status(400).json({
      message: !refresh_token
        ? "Refresh token is required"
        : "Grant_type is required",
    });
  }
});

exports.logout = asyncWrapper(async (req, res) => {
  let httpStatus = 200;
  let httpResponse = {};

  const { refresh_token } = req.body;
  let { type, session_token } = req.query;

  if (type) {
    if (type.toLowerCase() == "all") {
      type = "all";
    } else if (type.toLowerCase() == "one") {
      type = "one";
    }
  } else {
    type = "one";
  }

  if (refresh_token) {
    const tokenDetails = await tokenModel.getTokenData({
      refreshToken: refresh_token,
    });
    if (tokenDetails) {
      if (type == "one") {
        if (session_token) {
          const deleteResponse = await deleteSessionToken({
            uid: tokenDetails.uid,
            sessionToken: session_token,
          });
          if (deleteResponse.status) {
            httpResponse.status = true;
          } else {
            httpStatus = 500;
          }
        } else {
          const deleteResponse = await deleteSessionToken({
            uid: tokenDetails.uid,
            sessionToken: tokenDetails.sessionToken,
          });
          if (deleteResponse.status) {
            httpResponse.status = true;
          } else {
            httpStatus = 500;
          }
        }
      } else if (type == "all") {
        const deleteResponse = await authModel.deleteSessionToken({
          uid: tokenDetails[0].uid,
        });
        if (deleteResponse.status) {
          httpResponse.status = true;
        } else {
          httpStatus = 500;
        }
      }
    } else {
      httpStatus = 400;
      httpResponse.message = "Invalid Refresh token provided";
    }
  } else {
    httpStatus = 400;
    httpResponse.message = "Refresh token required";
  }

  if (httpResponse.error && !httpResponse.message) {
    httpResponse.message = "Something went wrong.";
  }
  return res.status(httpStatus).json(httpResponse);
});
