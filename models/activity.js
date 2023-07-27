const mongoose = require("mongoose");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const location = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
});
const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  activityImage: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  attendanceStartTime: {
    type: String,
    required: true,
  },
  attendanceEndTime: {
    type: String,
    required: true,
  },
  location: {
    type: location,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
});
const Activity = mongoose.model("Activity", activitySchema);

function validateActivity(activity) {
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().max(200).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required(),
    attendanceStartTime: Joi.string().required(),
    attendanceEndTime: Joi.string().required(),
    location: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    active: Joi.string().valid("active", "inactive"),
  });
  return schema.validate(activity);
}

function validateUserActivity(activity) {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
  });
  return schema.validate(activity);
}
exports.activitySchema = activitySchema;
exports.Activity = Activity;
exports.validate = validateActivity;
exports.validateUser = validateUserActivity;
