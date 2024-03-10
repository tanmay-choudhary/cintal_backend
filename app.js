const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const patientsRoute = require("./routes/patients.js");
const doctorsRoute = require("./routes/doctor.js");
const authRoute = require("./auth/auth_route.js");
global.asyncWrapper = require("./middleware/asyncWrapper");
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());
app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
app.use("/doctors", doctorsRoute);
app.use("/patients", patientsRoute);
app.use("/auth", authRoute);
module.exports = app;
