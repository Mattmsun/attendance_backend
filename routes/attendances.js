const { Activity } = require("../models/activity");
const {
  Attendance,
  validate,
  validateStatus,
} = require("../models/attendance");
const express = require("express");
const { Participant } = require("../models/participant");
const { User } = require("../models/user");
const router = express.Router();
// const Fawn = require("fawn");
// const mongoose = require("mongoose");
// Fawn.init(mongoose);

router.get("/:id", async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);
  if (!attendance) res.status(404).send("no attendance found");
  res.send(attendance);
});

router.get("/", async (req, res) => {
  const attendance = await Attendance.find().select("particiant.name");
  res.send(attendance);
});

//get attendance which status is "inactive"
router.get("/inactive", async (req, res) => {
  const attendance = await Attendance.find({ status: "inactive" }).select(
    "activity.name activity.startDate activity.endDate activity.location.name user.name _id user.image created_date"
  );
  res.send(attendance);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const activity = await Activity.findById(req.body.activityId);
  if (!activity) return res.status(400).send("activity not found");

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("User not found");

  const {
    _id,
    name,
    desc,
    activityImage,
    startDate,
    endDate,
    attendanceStartTime,
    attendanceEndTime,
    location,
  } = activity;
  let attendance = new Attendance({
    user: {
      _id: user._id,
      name: user.name,
      image: user.image,
    },
    activity: {
      _id,
      name,
      activityImage,
      desc,
      startDate,
      endDate,
      location,
      attendanceStartTime,
      attendanceEndTime,
    },
    modified_date: Date.now(),
    created_date: Date.now(),
  });
  attendance = await attendance.save();
  res.send(attendance);
});

//批准或拒绝申请
router.put("/status:id", async (req, res) => {
  const { error } = validateStatus(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    { status: req.body.approved ? "active" : "rejected" },
    { new: true }
  );
  if (!attendance) res.status(404).send("no attendance found");
  res.send(attendance);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    { participant: req.body.participant },
    { new: true }
  );
  if (!attendance) res.status(404).send("no attendance found");
  res.send(attendance);
});

router.delete(":/id", async (req, res) => {
  const attendance = await Attendance.findByIdAndRemove(req.params.id);
  if (!attendance) res.status(404).send("no attendance found");
  res.send(attendance);
});

module.exports = router;
