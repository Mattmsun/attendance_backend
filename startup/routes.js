const express = require("express");
const bodyParser = require("body-parser");
const activities = require("../routes/activities");
const attendances = require("../routes/attendances");
const users = require("../routes/users");
const error = require("../middleware/error");
var cors = require("cors");

module.exports = function (app) {
  app.use("/public", express.static("public"));
  app.use(cors());
  // app.use(express.json());
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  app.use("/api/activities", activities);
  app.use("/api/attendances", attendances);
  app.use("/api/users", users);
  app.use(error);
};
