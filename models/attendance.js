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
const Attendance = mongoose.model(
  "Attendance",
  new mongoose.Schema({
    user: new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        require: true,
      },
    }),

    activity: new mongoose.Schema({
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
    }),
    attendance_date: {
      type: [Date],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "rejected"],
      default: "inactive",
    },
    modified_date: {
      type: Date,
      required: true,
    },
    created_date: {
      type: Date,
      required: true,
    },
  })
);

function validateAttendance(attendance) {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    activityId: Joi.objectId().required(),
    // date: Joi.date().required(),
  });
  return schema.validate(attendance);
}

function validateStatus(attendance) {
  const schema = Joi.object({
    approved: Joi.boolean().required(),
  });
  return schema.validate(attendance);
}
exports.Attendance = Attendance;
exports.validate = validateAttendance;
exports.validateStatus = validateStatus;
