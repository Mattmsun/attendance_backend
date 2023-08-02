require("winston-mongodb");
const winston = require("winston");

require("express-async-errors");
const uri =
  "mongodb+srv://mattmsun:82128689@attendance.6jt9j8b.mongodb.net/?retryWrites=true&w=majority";
module.exports = function () {
  winston.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: uri,
      level: "error",
      dbName: "attendance",
    })
  );
  winston.add(
    new winston.transports.File({ filename: "error.log", level: "error" })
  );
  winston.add(new winston.transports.File({ filename: "log" }));
  //process.on("uncaughtException", (ex) => {
  //   console.log("WE GOT AN UNCAUGHT EXCEPTION");
  //   winston.error(ex.message, ex);
  //   //terminate the server
  //   process.exit(1);
  // });
  winston.add(
    new winston.transports.File({
      filename: "uncaughtException.log",
      handleExceptions: true,
      level: "error",
    })
  );
  // process.on("unhandledRejection", (ex) => {
  //   console.log("WE GOT AN UNHANDLED REJECTION");
  //   winston.error(ex.message, ex);
  //   //terminate the server
  //   process.exit(1);
  // });
};
