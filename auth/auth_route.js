const express = require("express");
const router = express.Router();
const { test, signup, login } = require("./auth_controller.js");

//testing route
router.get("/auth-test", test);
//

router.post("/sign-up", signup);
router.post("/login", login);

module.exports = router;
