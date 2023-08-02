const winston = require("winston");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://mattmsun:82128689@attendance.6jt9j8b.mongodb.net/?retryWrites=true&w=majority";
module.exports = async function () {
  await mongoose.connect(uri, {
    useUnifiedTopology: true,
    dbName: "attendance",
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  //   winston.info("connected to mongodb");

  console.log("connected to mongodb");
};
