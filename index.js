require("express-async-errors");
require("winston-mongodb");
const config = require("config");
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  https
    .createServer(
      {
        key: fs.readFileSync(path.join(__dirname, "cert/cert.key")),
        cert: fs.readFileSync(path.join(__dirname, "cert/cert.pem")),
      },
      app
    )
    .listen(80, () => {
      console.log(`listening on port 80`);
    });
} else {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}
