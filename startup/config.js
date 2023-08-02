const config = require("config");
module.exports = function () {
  console.log("app name :" + config.get("name"));
  if (!config.get("appId")) {
    throw new Error("FATAL ERROR: appId is not defined");
  } else if (!config.get("key")) {
    throw new Error("FATAL ERROR: key is not defined");
  } else if (!config.get("accessKey")) {
    throw new Error("FATAL ERROR: accessKey is not defined");
  } else if (!config.get("accessSecret")) {
    throw new Error("FATAL ERROR: accessSecret is not defined");
  }
};
