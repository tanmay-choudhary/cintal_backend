const express = require("express");
const bodyParser = require("body-parser");
const patientsRoute = require("./routes/patients.js");
global.asyncWrapper = require("./middleware/asyncWrapper");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

app.use("/patients", patientsRoute);

module.exports = app;
