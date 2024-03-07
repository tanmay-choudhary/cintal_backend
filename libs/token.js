const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const tokenModel = require("../token/token_model");
const date = require("date-and-time");
const sessionHelper = require("../helpers/session");
const path = require("path");
const fs = require("fs");
class Token {
  constructor() {
    this.privateKey = process.env.JWT_PRIVATE_KEY;
    this.accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
    this.otpTokenExpiry = process.env.OTP_TOKEN_EXPIRY;
  }
  async accessToken({ refreshToken }) {
    const resp = { status: true };
    const validateRefreshToken = await tokenModel.getTokenData({
      refreshToken,
    });
    //Checking whether the refresh token is valid or not.
    if (
      validateRefreshToken?.length &&
      new Date(validateRefreshToken[0].expiry_at) >= new Date()
    ) {
      /**
       * Before signing the accessToken first check whether the session file is still valid or not.
       * if Not then throw error that session is expired
       * Otherwise just sign the accessToken
       */
      const filePath = path.join(
        __dirname,
        `../config/sessions/${validateRefreshToken[0].session_token}`
      );
      let stats;
      try {
        stats = fs.statSync(filePath); // create meta data object of file or fetch file details
        if (stats) {
          const accessToken = jwt.sign(
            {
              uid: validateRefreshToken[0].uid,
              session_token: validateRefreshToken[0].session_token,
            },
            this.privateKey,
            {
              expiresIn: this.accessTokenExpiry,
            }
          );
          resp.data = accessToken;
        } else {
          resp.status = false;
          resp.error = "Session expired.,please login again.";
        }
      } catch (error) {
        resp.status = false;
        resp.error = "Session expired.,please login again.";
      }
    } else {
      resp.status = false;
      resp.error =
        validateRefreshToken.error ||
        "refresh token is expired,please login again.";
    }
    return resp;
  }

  async createRefreshToken({ uid }) {
    const sessionTokenResponse = await sessionHelper.generateSessionToken();
    if (!sessionTokenResponse.status) {
      return false;
    }
    const sessionToken = sessionTokenResponse.sessionToken;

    let refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

    let now = new Date();
    const createdAt = date.format(now, "YYYY-MM-DD HH:mm:ss");
    const expiryAt = date.format(
      date.addDays(now, +refreshTokenExpiry),
      "YYYY-MM-DD HH:mm:ss"
    );

    // generate new refresh token value using uuid function
    let refreshToken = randomUUID();
    await tokenModel.saveRefreshToken({
      uid,
      refreshToken,
      sessionToken,
      createdAt,
      expiryAt,
    });
    return refreshToken;
  }

  async tokenValidity({ refreshToken }) {
    try {
      const isValid = await tokenModel.getTokenData({
        refreshToken,
      });
      if (isValid?.length && new Date(isValid[0].expiry_at) >= new Date()) {
        const filePath = path.join(
          __dirname,
          `../config/sessions/${isValid[0].session_token}`
        );
        try {
          const stats = fs.statSync(filePath); // create meta data object of file or fetch file details
          if (!stats) {
            return false;
          }
        } catch (error) {
          return false;
        }
        return true;
      } else return false;
    } catch (error) {
      return false;
    }
  }

  decode(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, this.privateKey);
      return decoded;
    } catch (err) {
      return false;
    }
  }
}

module.exports = Token;
