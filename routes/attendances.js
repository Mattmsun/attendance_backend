const { Activity } = require("../models/activity");
const {
  Attendance,
  validate,
  validateStatus,
  validateAttend,
  validateRecord,
} = require("../models/attendance");
const express = require("express");
const { User } = require("../models/user");
const config = require("config");
const auth = require("../middleware/auth");
const { isActivityEndFirstDay } = require("../utils/date");
const router = express.Router();

// const Fawn = require("fawn");
// const mongoose = require("mongoose");
// Fawn.init(mongoose);

//获取用户签到信息
router.post("/active/record", async (req, res) => {
  const { error } = validateRecord(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const attendance = await Attendance.find({
    "user._id": req.body.userId,
    status: "active",
  }).select("-user");
  res.send(attendance);
});

//get attendance which status is "inactive"
router.get("/inactive", async (req, res) => {
  const attendance = await Attendance.find({ status: "inactive" }).select(
    "activity.name activity.startDate activity.endDate activity.location.name user.name _id user.image created_date"
  );

  res.send(attendance);
});

router.post("/users", auth, async (req, res) => {
  const attendance = await Attendance.find({
    status: "active",
  });
  if (attendance.length !== 0) {
    //返回已开始签到的项目
    const filtered = attendance.filter((a) =>
      isActivityEndFirstDay(a.activity.startDate, a.activity.attendanceEndTime)
    );
    return res.send(filtered);
  }
  // .select("user.name user.image activity attendance_date");
  res.send(attendance);
});

//批准或拒绝申请
router.put("/status:id", async (req, res) => {
  const { error } = validateStatus(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { approved } = req.body;
  if (approved) {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );
    if (!attendance) res.status(404).send("no attendance found");
    res.send(attendance);
  } else {
    const attendance = await Attendance.findByIdAndRemove(req.params.id);
    if (!attendance) res.status(404).send("no attendance found");
    res.send(attendance);
  }
});

router.get("/:id", async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);
  if (!attendance) res.status(404).send("no attendance found");
  res.send(attendance);
});

//签到
router.put("/:id", async (req, res) => {
  const { error } = validateAttend(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        attendance_date: req.body.attendanceDate,
      },
      modified_date: new Date(),
    },
    { new: true }
  );
  if (!attendance) res.status(404).send("no attendance found");
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

router.delete(":/id", async (req, res) => {
  const attendance = await Attendance.findByIdAndRemove(req.params.id);
  if (!attendance) res.status(404).send("no attendance found");
  res.send(attendance);
});

module.exports = router;
