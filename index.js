require("express-async-errors");
require("winston-mongodb");
const winston = require("winston");
const config = require("config");
const express = require("express");

const bodyParser = require("body-parser");
const error = require("./middleware/error");
const activities = require("./routes/activities");
const attendances = require("./routes/attendances");
const users = require("./routes/users");
var cors = require("cors");
const app = express();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

// app.use("/public", express.static("public"));
// app.use(cors());
// // app.use(express.json());
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// app.use("/api/activities", activities);
// app.use("/api/attendances", attendances);
// app.use("/api/users", users);
// app.use(error);
//configeration

// process.on("uncaughtException", (ex) => {
//   console.log("WE GOT AN UNCAUGHT EXCEPTION");
//   winston.error(ex.message, ex);
//   //terminate the server
//   process.exit(1);
// });
// winston.add(
//   new winston.transports.File({
//     filename: "uncaughtException.log",
//     handleExceptions: true,
//   })
// );
// process.on("unhandledRejection", (ex) => {
//   console.log("WE GOT AN UNHANDLED REJECTION");
//   winston.error(ex.message, ex);
//   //terminate the server
//   process.exit(1);
// });
// winston.add(new winston.transports.MongoDB({ db: uri }));
// winston.add(
//   new winston.transports.File({ filename: "error.log", level: "error" })
// );

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// connect();
console.log(config.get("appId"));
console.log(config.get("key"));
